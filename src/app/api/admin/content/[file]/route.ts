import { NextResponse } from "next/server";
import { getCollection } from "@/lib/cms/registry";
import {
  branchExists,
  ensureDraftBranch,
  getDraftBranch,
  getFileSha,
  getJsonFile,
  getProdBranch,
  githubConfigured,
  putJsonFile,
} from "@/lib/github";
import { defaultEntryFor, slugify } from "@/lib/cms/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fileName = (path: string) => path.split("/").pop() ?? path;

/** Map a GitHub write error to a response — a stale-sha conflict (409) becomes a
 *  clear "reload" message rather than an opaque 502. */
function githubError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/\(409\)|does not match|but expected/i.test(message)) {
    return NextResponse.json(
      { error: "conflict", message: "The content changed since you loaded it — please reload the page and try again." },
      { status: 409 },
    );
  }
  return NextResponse.json({ error: "github_error", message }, { status: 502 });
}

/** GET — load a collection's JSON (fresh from GitHub) for editing. */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const col = getCollection(file);
  if (!col) return NextResponse.json({ error: "unknown_collection" }, { status: 404 });
  if (!githubConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "Loading/saving needs GITHUB_TOKEN and GITHUB_REPO." },
      { status: 503 },
    );
  }
  try {
    // Edit against the draft branch so editors reflect unpublished changes;
    // before any draft exists, read the live (production) content.
    const draft = getDraftBranch();
    const ref = (await branchExists(draft)) ? draft : getProdBranch();
    const { data, sha } = await getJsonFile(col.file, ref);
    return NextResponse.json({ id: col.id, mode: col.mode, data, sha });
  } catch (error) {
    return githubError(error);
  }
}

/** PUT — object mode: replace the whole file; list mode: replace one entry by slug. Validated, then committed. */
export async function PUT(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const col = getCollection(file);
  if (!col) return NextResponse.json({ error: "unknown_collection" }, { status: 404 });
  if (!githubConfigured()) {
    return NextResponse.json({ error: "not_configured", message: "Saving needs GITHUB_TOKEN and GITHUB_REPO." }, { status: 503 });
  }

  let body: { data?: unknown; page?: ({ slug?: unknown; title?: unknown } & Record<string, unknown>) | null };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  try {
    // Saves commit to the draft branch — production (and the deploy) stays untouched
    // until the editor clicks Publish.
    await ensureDraftBranch();
    const draft = getDraftBranch();

    if (col.mode === "object") {
      const result = col.validate(body.data);
      if (!result.ok) return NextResponse.json({ error: "invalid", errors: result.errors }, { status: 422 });
      const sha = await getFileSha(col.file, draft);
      const commit = await putJsonFile(col.file, body.data, sha, `CMS: update ${fileName(col.file)}`, draft);
      return NextResponse.json({ ok: true, commitSha: commit.commitSha });
    }

    // list mode — replace the one entry matched by slug
    const page = body.page;
    if (!page || typeof page !== "object" || typeof page.slug !== "string" || page.slug.trim() === "") {
      return NextResponse.json({ error: "bad_request", message: "Expected a { page } with a slug." }, { status: 400 });
    }
    const { data, sha } = await getJsonFile<Array<{ slug: string }>>(col.file, draft);
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "github_error", message: "Collection file is not a list." }, { status: 502 });
    }
    const index = data.findIndex((p) => p.slug === page.slug);
    if (index === -1) {
      return NextResponse.json({ error: "not_found", message: `No entry with slug "${String(page.slug)}".` }, { status: 404 });
    }
    const next = data.slice();
    next[index] = page as (typeof next)[number];
    const result = col.validate(next);
    if (!result.ok) return NextResponse.json({ error: "invalid", errors: result.errors }, { status: 422 });
    const title = typeof page.title === "string" ? page.title : page.slug;
    const commit = await putJsonFile(col.file, next, sha, `CMS: update ${fileName(col.file)} (${title})`, draft);
    return NextResponse.json({ ok: true, commitSha: commit.commitSha });
  } catch (error) {
    return githubError(error);
  }
}

/** POST — list mode: create a new entry from a title; the server owns the unique slug. */
export async function POST(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const col = getCollection(file);
  if (!col) return NextResponse.json({ error: "unknown_collection" }, { status: 404 });
  if (col.mode !== "list") {
    return NextResponse.json({ error: "bad_request", message: "Create is only supported for list collections." }, { status: 400 });
  }
  if (!githubConfigured()) {
    return NextResponse.json({ error: "not_configured", message: "Creating needs GITHUB_TOKEN and GITHUB_REPO." }, { status: 503 });
  }

  let body: { title?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "bad_request", message: "A title is required." }, { status: 400 });

  try {
    await ensureDraftBranch();
    const draft = getDraftBranch();
    const { data, sha } = await getJsonFile<Array<{ slug: string }>>(col.file, draft);
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "github_error", message: "Collection file is not a list." }, { status: 502 });
    }
    const taken = new Set(data.map((p) => p.slug));
    const base = slugify(title) || "post";
    let slug = base;
    let n = 2;
    // On collision append "-N", reserving room so the result never exceeds the
    // 60-char slug limit (which would otherwise fail validation un-fixably).
    while (taken.has(slug)) {
      const suffix = `-${n++}`;
      slug = base.slice(0, 60 - suffix.length).replace(/-+$/, "") + suffix;
    }

    const entry = defaultEntryFor(file, slug, title);
    if (!entry) {
      return NextResponse.json({ error: "bad_request", message: `Creating "${file}" entries is not supported.` }, { status: 400 });
    }
    const next = [entry, ...data];
    const result = col.validate(next);
    if (!result.ok) return NextResponse.json({ error: "invalid", errors: result.errors }, { status: 422 });
    const commit = await putJsonFile(col.file, next, sha, `CMS: create ${fileName(col.file)} (${slug})`, draft);
    return NextResponse.json({ ok: true, slug, commitSha: commit.commitSha });
  } catch (error) {
    return githubError(error);
  }
}

/** DELETE ?slug= — list mode: remove one entry by slug. */
export async function DELETE(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const col = getCollection(file);
  if (!col) return NextResponse.json({ error: "unknown_collection" }, { status: 404 });
  if (col.mode !== "list") {
    return NextResponse.json({ error: "bad_request", message: "Delete is only supported for list collections." }, { status: 400 });
  }
  if (!githubConfigured()) {
    return NextResponse.json({ error: "not_configured", message: "Deleting needs GITHUB_TOKEN and GITHUB_REPO." }, { status: 503 });
  }
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) return NextResponse.json({ error: "bad_request", message: "A ?slug= is required." }, { status: 400 });

  try {
    await ensureDraftBranch();
    const draft = getDraftBranch();
    const { data, sha } = await getJsonFile<Array<{ slug: string }>>(col.file, draft);
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "github_error", message: "Collection file is not a list." }, { status: 502 });
    }
    const index = data.findIndex((p) => p.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "not_found", message: `No entry with slug "${slug}".` }, { status: 404 });
    }
    const next = data.filter((_, i) => i !== index);
    const result = col.validate(next);
    if (!result.ok) return NextResponse.json({ error: "invalid", errors: result.errors }, { status: 422 });
    const commit = await putJsonFile(col.file, next, sha, `CMS: delete ${fileName(col.file)} (${slug})`, draft);
    return NextResponse.json({ ok: true, commitSha: commit.commitSha });
  } catch (error) {
    return githubError(error);
  }
}
