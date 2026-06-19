"use client";

import { useState } from "react";
import { Headset, Phone, X } from "lucide-react";
import { siteConfig } from "@/lib/content";

/**
 * Floating contact speed-dial (bottom-right). Fans out a "Call us" action on
 * hover (desktop) or tap (touch).
 */
export function ContactDock() {
  const [dockOpen, setDockOpen] = useState(false);
  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  const fanVisible = dockOpen
    ? "visible translate-y-0 opacity-100"
    : "invisible translate-y-2 opacity-0";

  return (
    <>
      <div className="group fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Fan-out actions */}
        <div
          className={`mb-3.5 flex flex-col items-end gap-3.5 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${fanVisible}`}
        >
          {/* Call us — primary, bronze */}
          <a href={phoneHref} className="group/item flex items-center gap-2.5">
            <span className="rounded-full border border-bronze/30 bg-white px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-bronze shadow-md">
              Call us
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-bronze text-white shadow-lg shadow-bronze/35 ring-2 ring-white transition-colors duration-300 group-hover/item:bg-bronze-600">
              <Phone className="h-5 w-5" strokeWidth={1.7} aria-hidden />
            </span>
          </a>
        </div>

        {/* Main button */}
        <div className="relative">
          {!dockOpen && (
            <span
              className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-bronze/30"
              aria-hidden
            />
          )}
          <button
            type="button"
            onClick={() => setDockOpen((v) => !v)}
            aria-expanded={dockOpen}
            aria-haspopup="true"
            aria-label={dockOpen ? "Close contact options" : "Contact options"}
            className="relative grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-xl shadow-ink/30 ring-2 ring-white transition-all duration-300 hover:scale-105 hover:bg-bronze"
          >
            {dockOpen ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </>
  );
}
