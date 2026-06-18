import { NextResponse } from "next/server";
import { getFileSha, githubConfigured, putRawFile } from "@/lib/github";
import { IMAGE_LIMITS, humanSize } from "@/lib/cms/limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Raster image types only (no SVG, to avoid script-in-SVG concerns on a committed asset).
const ALLOWED: Record<string, string> = { jpg: "jpg", jpeg: "jpg", png: "png", webp: "webp", gif: "gif" };
const MAX_BYTES = IMAGE_LIMITS.maxBytes; // central limit (~2.5 MB)

function slug(s: string, fallback: string): string {
  const out = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return out || fallback;
}

/** Max bounding-box (px) per upload context. */
function maxBox(dir: string): number {
  if (dir === "brand") return 700; // logos
  if (dir === "reviews") return 480; // small round avatars
  return 1800; // hero / general
}

/**
 * Auto-optimise an uploaded raster image: trim surrounding whitespace (logos
 * only), cap its dimensions, and recompress — keeping the original format.
 * `sharp` is imported lazily so any load/processing failure is caught by the
 * caller, which then falls back to committing the untouched upload.
 */
async function optimize(buf: Buffer, format: "png" | "jpg" | "webp", dir: string): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const pipeline = sharp(buf, { failOn: "none" });
  if (dir === "brand") pipeline.trim({ threshold: 12 }); // tighten logos to their artwork
  const box = maxBox(dir);
  pipeline.resize({ width: box, height: box, fit: "inside", withoutEnlargement: true });
  if (format === "png") pipeline.png({ compressionLevel: 9, palette: dir === "brand" });
  else if (format === "webp") pipeline.webp({ quality: 82 });
  else pipeline.jpeg({ quality: 82, mozjpeg: true });
  return pipeline.toBuffer();
}

/** POST { filename, contentBase64, dir } → commit the image to public/<dir>/ and return its public path. */
export async function POST(request: Request) {
  if (!githubConfigured()) {
    return NextResponse.json(
      { error: "not_configured", message: "Uploads need GITHUB_TOKEN and GITHUB_REPO." },
      { status: 503 },
    );
  }

  let body: { filename?: unknown; contentBase64?: unknown; dir?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const filename = typeof body.filename === "string" ? body.filename : "";
  const base64 = typeof body.contentBase64 === "string" ? body.contentBase64 : "";
  const dir = slug(typeof body.dir === "string" ? body.dir : "uploads", "uploads");
  if (!filename || !base64) {
    return NextResponse.json({ error: "bad_request", message: "filename + contentBase64 required." }, { status: 400 });
  }

  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (!(ext in ALLOWED)) {
    return NextResponse.json({ error: "bad_type", message: "Only JPG, PNG, WEBP or GIF images are allowed." }, { status: 415 });
  }
  if (Math.floor((base64.length * 3) / 4) > MAX_BYTES) {
    return NextResponse.json(
      { error: "too_large", message: `Image must be under ${humanSize(MAX_BYTES)}.` },
      { status: 413 },
    );
  }

  const base = slug(filename.replace(/\.[^.]+$/, ""), "image");
  const format = ALLOWED[ext] as "png" | "jpg" | "webp" | "gif";
  const repoPath = `public/${dir}/${base}-${Date.now().toString(36)}.${format}`;
  const publicPath = repoPath.replace(/^public/, "");

  // Auto-optimise (trim/resize/compress). Animated GIFs and any sharp failure
  // fall back to committing the original upload, so a save never breaks.
  let outBase64 = base64;
  if (format !== "gif") {
    try {
      const optimised = await optimize(Buffer.from(base64, "base64"), format, dir);
      outBase64 = optimised.toString("base64");
    } catch {
      outBase64 = base64;
    }
  }

  try {
    const sha = await getFileSha(repoPath); // normally null (unique name)
    await putRawFile(repoPath, outBase64, `CMS: upload ${dir}/${base}.${format}`, sha);
    return NextResponse.json({ ok: true, path: publicPath });
  } catch (error) {
    return NextResponse.json(
      { error: "github_error", message: error instanceof Error ? error.message : String(error) },
      { status: 502 },
    );
  }
}
