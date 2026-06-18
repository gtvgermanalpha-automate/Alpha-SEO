"use client";

import { useRef, useState } from "react";
import { labelClass } from "@/components/admin/fields";
import { IMAGE_LIMITS, humanSize } from "@/lib/cms/limits";

/** Read a File as a data URL. */
function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

/** Decode an image data URL to its pixel dimensions. */
function imageSize(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => reject(new Error("decode failed"));
    img.src = dataUrl;
  });
}

/** Image field with in-CMS upload: validates the file (type, size, dimensions)
 *  client-side BEFORE uploading, then commits it to the repo and stores the
 *  returned public path. Shows a preview + the constraints; supports removal. */
export function ImageField({
  value,
  onChange,
  dir = "uploads",
  label = "Image",
  round = false,
}: {
  value: string;
  onChange: (path: string) => void;
  dir?: string;
  label?: string;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  function fail(message: string) {
    setStatus("error");
    setError(message);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = ""; // allow re-picking the same file
    if (!file) return;
    setError("");

    // 1. Type
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!(IMAGE_LIMITS.types as readonly string[]).includes(ext)) {
      fail(`Unsupported file type ".${ext}". Allowed: ${IMAGE_LIMITS.types.join(", ").toUpperCase()}.`);
      return;
    }
    // 2. File size
    if (file.size > IMAGE_LIMITS.maxBytes) {
      fail(`That image is ${humanSize(file.size)} — the maximum is ${humanSize(IMAGE_LIMITS.maxBytes)}.`);
      return;
    }

    setStatus("uploading");
    try {
      const dataUrl = await readDataUrl(file);

      // 3. Dimensions
      let dims: { w: number; h: number };
      try {
        dims = await imageSize(dataUrl);
      } catch {
        fail("That file could not be read as an image.");
        return;
      }
      if (dims.w < IMAGE_LIMITS.minWidth || dims.h < IMAGE_LIMITS.minHeight) {
        fail(`Image is ${dims.w}×${dims.h}px — too small (minimum ${IMAGE_LIMITS.minWidth}×${IMAGE_LIMITS.minHeight}px).`);
        return;
      }
      if (dims.w > IMAGE_LIMITS.maxWidth || dims.h > IMAGE_LIMITS.maxHeight) {
        fail(`Image is ${dims.w}×${dims.h}px — too large (maximum ${IMAGE_LIMITS.maxWidth}×${IMAGE_LIMITS.maxHeight}px).`);
        return;
      }

      // 4. Upload
      const base64 = dataUrl.split(",")[1] ?? "";
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentBase64: base64, dir }),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { path?: string; message?: string };
      if (res.ok && data.path) {
        onChange(data.path);
        setStatus("idle");
      } else {
        fail(data.message ?? `Upload failed (${res.status}).`);
      }
    } catch {
      fail("Upload error — please try again.");
    }
  }

  const shape = round ? "rounded-full" : "rounded-md";

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className={`h-14 w-14 border border-line object-cover ${shape}`} />
        ) : (
          <span className={`grid h-14 w-14 place-items-center border border-dashed border-line text-[0.6rem] uppercase text-muted ${shape}`}>
            none
          </span>
        )}
        <div className="flex flex-col items-start gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-bronze hover:text-bronze disabled:opacity-60"
          >
            {status === "uploading" ? "Checking…" : value ? "Replace photo" : "Upload photo"}
          </button>
          {value && (
            <button type="button" onClick={() => onChange("")} className="text-xs text-muted hover:text-red-700">
              Remove
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept={IMAGE_LIMITS.accept} onChange={onFile} className="hidden" />
      </div>
      <p className="mt-1.5 text-[0.7rem] text-muted">
        {IMAGE_LIMITS.types.join(", ").toUpperCase()} · up to {humanSize(IMAGE_LIMITS.maxBytes)} ·{" "}
        {IMAGE_LIMITS.minWidth}–{IMAGE_LIMITS.maxWidth}px
      </p>
      {status === "error" && <p className="mt-1 text-xs font-medium text-red-700">{error}</p>}
    </div>
  );
}
