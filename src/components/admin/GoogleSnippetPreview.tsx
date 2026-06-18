import type { ReactNode } from "react";
import { siteConfig } from "@/lib/content";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Bold any occurrences of the focus keyword. */
function highlight(text: string, keyword?: string): ReactNode {
  const kw = keyword?.trim();
  if (!kw) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(kw)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === kw.toLowerCase() ? <b key={i} className="font-bold text-ink">{part}</b> : <span key={i}>{part}</span>,
  );
}

/** A Google-search-result preview of how a page's title/description will appear. */
export function GoogleSnippetPreview({
  route,
  title,
  description,
  focusKeyword,
}: {
  route: string;
  title: string;
  description: string;
  focusKeyword?: string;
}) {
  const host = siteConfig.url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const segments = route.split("/").filter(Boolean);
  const crumb = segments.length ? `${host} › ${segments.join(" › ")}` : host;

  const titleLong = title.length > 60;
  const descLong = description.length > 160;

  return (
    <div className="rounded-lg border border-line bg-white p-4 font-sans">
      <p className="truncate text-xs text-[#202124]/70">{crumb}</p>
      <p className="mt-1 truncate text-[1.05rem] leading-snug text-[#1a0dab]">{highlight(title, focusKeyword)}</p>
      <p className="mt-1 line-clamp-2 text-[0.82rem] leading-snug text-[#4d5156]">{highlight(description, focusKeyword)}</p>
      {(titleLong || descLong) && (
        <p className="mt-2 text-[0.68rem] text-amber-700">
          {titleLong && `Title is ${title.length} characters — Google may truncate beyond ~60. `}
          {descLong && `Description is ${description.length} characters — may truncate beyond ~160.`}
        </p>
      )}
    </div>
  );
}
