"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Seal } from "@/components/ui/Seal";
import { QuoteFormMini } from "@/components/QuoteFormMini";
import { easeOut } from "@/lib/motion";

const pillars = ["Fixed monthly fees", "Your own accountant", "Switch in days"];

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

export function HeroPhoto() {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };
  const item = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
      };

  return (
    <section id="home" className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          {/* Copy */}
          <motion.div variants={container} initial="hidden" animate="visible">
            <motion.span variants={item} className="flex items-center gap-3 text-bronze">
              <span className="h-px w-8 bg-bronze" aria-hidden />
              <span className="eyebrow">Chartered Accountants · UK-wide</span>
            </motion.span>

            <motion.h1
              variants={item}
              className="mt-6 text-balance text-[2.6rem] leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
            >
              Accountancy that moves your business{" "}
              <span className="italic text-bronze">forward</span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              MMR Accountants gives ambitious UK companies and contractors a proactive,
              cloud-first finance team — tax, advisory and payroll, delivered with the
              discretion and precision of a private practice.
            </motion.p>

            <motion.ul variants={item} className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              {pillars.map((p, i) => (
                <li key={p} className="flex items-center gap-4">
                  {i > 0 && <span className="h-3.5 w-px bg-bronze/50" aria-hidden />}
                  <span className="eyebrow text-ink">{p}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="primary" size="lg" withArrow>
                Get a Quote
              </ButtonLink>
              <ButtonLink href="/services" variant="ghost" size="lg">
                Our Services
              </ButtonLink>
            </motion.div>

            <motion.div variants={item} className="mt-10 flex items-center gap-4 border-t border-line pt-6">
              <div className="flex items-center gap-1 text-bronze" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="text-sm text-muted">
                Rated excellent by <span className="font-semibold text-ink">1,200+</span> UK businesses
              </p>
            </motion.div>
          </motion.div>

          {/* Photograph + quote form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* bronze offset frame */}
            <div className="absolute -right-3 -top-3 hidden h-2/3 w-2/3 border border-bronze sm:block" aria-hidden />

            <div className="relative aspect-[5/4] w-full overflow-hidden border border-ink">
              <Image
                src="/hero.jpg"
                alt="An MMR Accountants adviser meeting with a business client in a modern office"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover [filter:grayscale(0.15)_contrast(1.02)]"
              />
            </div>

            {/* Seal sticker */}
            <div className="absolute -left-5 -top-5 hidden h-[5.5rem] w-[5.5rem] place-items-center rounded-full border border-line bg-white shadow-md sm:grid">
              <Seal id="hero-seal" className="h-[4.75rem] w-[4.75rem]" />
            </div>

            {/* Quote form overlapping the photo's lower edge */}
            <div className="relative z-10 mx-3 -mt-16 sm:mx-8 sm:-mt-20 lg:mx-10">
              <QuoteFormMini />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
