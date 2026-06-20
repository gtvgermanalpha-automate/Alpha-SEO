"use client";

import { useState } from "react";
import { copy, faqs } from "@/lib/content";

/** FAQ accordion — ported from the original static site. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{copy.faq.heading.eyebrow}</span>
          <h2>{copy.faq.heading.title}</h2>
        </div>
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
      </div>
    </section>
  );
}
