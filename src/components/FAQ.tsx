"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { copy, faqs } from "@/lib/content";
import { jsonLd } from "@/lib/jsonLd";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative scroll-mt-24 border-b border-line bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading {...copy.faq.heading} />

        <div className="mx-auto mt-16 max-w-3xl">
          <ul className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              const buttonId = `faq-button-${i}`;
              return (
                <Reveal as="li" key={faq.question} delay={i * 0.03}>
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
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-cream/40 p-8 text-center">
            <p className="font-display text-xl text-ink">{copy.faq.stillHaveTitle}</p>
            <p className="max-w-md text-sm text-muted">{copy.faq.stillHaveText}</p>
            <ButtonLink href="/contact" variant="primary" withArrow>
              {copy.faq.stillHaveCta}
            </ButtonLink>
          </div>
        </div>
      </Container>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
    </section>
  );
}
