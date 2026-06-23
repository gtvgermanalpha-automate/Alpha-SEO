import { NextResponse } from "next/server";
import { getDraftStatus, githubConfigured, publishDraft, resetDraftToProd } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Gated by the /api/admin proxy middleware — a valid session is already required. */

function notConfigured() {
  return NextResponse.json(
    { error: "not_configured", message: "Publishing needs GITHUB_TOKEN and GITHUB_REPO." },
    { status: 503 },
  );
}

function ghError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  // publishDraft throws "conflict: …" when the draft and live site diverged.
  if (/^conflict:/i.test(message)) {
    return NextResponse.json({ error: "conflict", message: message.replace(/^conflict:\s*/i, "") }, { status: 409 });
  }
  return NextResponse.json({ error: "github_error", message }, { status: 502 });
}

/** GET — how many unpublished (draft) changes are waiting to be published. */
export async function GET() {
  if (!githubConfigured()) return NextResponse.json({ configured: false, pending: 0, files: [] });
  try {
    const status = await getDraftStatus();
    return NextResponse.json({ configured: true, pending: status.pending, files: status.files });
  } catch (error) {
    return ghError(error);
  }
}

/** POST — publish: merge the draft branch into production. This is the ONLY action
 *  that triggers a deploy, so the live site updates once, deliberately. */
export async function POST() {
  if (!githubConfigured()) return notConfigured();
  try {
    const result = await publishDraft("CMS: publish draft changes");
    if (!result.merged) return NextResponse.json({ ok: true, merged: false, message: "Nothing to publish." });
    return NextResponse.json({ ok: true, merged: true, commitSha: result.commitSha });
  } catch (error) {
    return ghError(error);
  }
}

/** DELETE — discard all unpublished changes (reset the draft branch to production). */
export async function DELETE() {
  if (!githubConfigured()) return notConfigured();
  try {
    await resetDraftToProd();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return ghError(error);
  }
}
