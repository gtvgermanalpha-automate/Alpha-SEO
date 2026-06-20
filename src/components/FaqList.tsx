"use client";

import { useState } from "react";

/** Accordion FAQ list — emits the original static-site `.faq-list` markup.
 *  Shared by the home FAQ, the FAQ page and the service-detail pages. */
export function FaqList({ faqs, defaultOpen = 0 }: { faqs: { question: string; answer: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className={`faq-item${open === i ? " open" : ""}`} key={f.question}>
          <button
            type="button"
            className="faq-question"
            aria-expanded={open === i}
            onClick={() => setOpen((o) => (o === i ? null : i))}
          >
            <span>{f.question}</span>
            <span className="faq-toggle">+</span>
          </button>
          <div className="faq-answer">
            <div className="faq-answer-inner">{f.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
