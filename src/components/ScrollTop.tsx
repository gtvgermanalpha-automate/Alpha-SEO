"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Fixed scroll-to-top button (bottom-left); appears once the user scrolls down. */
export function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 left-6 z-40 hidden h-11 w-11 place-items-center border border-ink bg-white text-ink shadow-sm transition-all duration-300 hover:bg-ink hover:text-white sm:grid ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={1.6} aria-hidden />
    </button>
  );
}
