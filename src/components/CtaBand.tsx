"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { DotCluster, RingAccent } from "@/components/ui/Decorations";
import { copy, siteConfig } from "@/lib/content";

/** High-contrast conversion band — an aster panel with continuously animated glow + decorations. */
export function CtaBand() {
  const reduce = useReducedMotion();
  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-brand-blue px-6 py-16 text-center sm:px-12 lg:py-20">
          {/* Aster-surface decorations — matches the hero (dot-grid, rings, glows, sheen) */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* faint ink dot-grid */}
            <div className="absolute inset-0 bg-brand-dotgrid" />
            {/* concentric rings */}
            <div className="absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full border border-ink/10" />
            <div className="absolute -left-16 -bottom-24 h-72 w-72 rounded-full border border-ink/[0.08]" />
            {/* Static glows — animating large blur surfaces is too GPU-heavy */}
            <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-ink/5 blur-3xl" />
            <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-ink/5 blur-3xl" />
            {/* Opacity-only breathing glow (compositor-cheap — no re-rasterising the blur) */}
            <motion.div
              className="absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/40 blur-3xl"
              animate={reduce ? {} : { opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Sweeping sheen — a thin, un-blurred gradient (cheap) */}
            <motion.div
              className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={reduce ? {} : { x: ["0%", "420%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3.5 }}
            />
          </div>

          {/* Slowly rotating ring + dot cluster */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-8 hidden sm:block"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
          >
            <RingAccent className="h-28 w-28" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-8 top-8 hidden sm:block"
            animate={reduce ? {} : { y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <DotCluster className="h-16 w-16 opacity-50" />
          </motion.div>

          <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center">
            <span className="flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-accent/50" aria-hidden />
              <span className="eyebrow">{copy.cta.eyebrow}</span>
              <span className="h-px w-8 bg-accent/50" aria-hidden />
            </span>
            <h2 className="mt-5 text-3xl text-ink sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
              {copy.cta.title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">{copy.cta.subtitle}</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <ButtonLink href="/contact" variant="bronze" size="lg" withArrow>
                {copy.cta.primaryCta}
              </ButtonLink>
              <ButtonLink href={phoneHref} variant="light" size="lg">
                Call {siteConfig.contact.phoneDisplay}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
