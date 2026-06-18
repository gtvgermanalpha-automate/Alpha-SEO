"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { type DetailFaq } from "@/lib/detailContent";

/** Reusable FAQ accordion (mirrors the home FAQ section), driven by a faqs array. */
export function FaqAccordion({ faqs }: { faqs: DetailFaq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <ul className="flex flex-col gap-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        const panelId = `dfaq-panel-${i}`;
        const buttonId = `dfaq-button-${i}`;
        return (
          <li key={faq.question}>
            <div
              className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                isOpen ? "border-accent/30 bg-accent-50 shadow-sm" : "border-line bg-white"
              }`}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className={`text-base font-bold transition-colors sm:text-lg ${isOpen ? "text-accent" : "text-ink"}`}>
                    {faq.question}
                  </span>
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                      isOpen ? "bg-accent text-white" : "bg-blue text-navy"
                    }`}
                  >
                    <Plus className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} strokeWidth={2} aria-hidden />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted sm:text-[0.95rem]">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
