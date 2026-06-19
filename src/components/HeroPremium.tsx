"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import { GoogleG } from "@/components/ui/brands";
import { easeOut } from "@/lib/motion";
import { copy, googleReviewsUrl, reviewsMeta } from "@/lib/content";

export function HeroPremium({ cutoutSrc = null }: { cutoutSrc?: string | null }) {
  const reduce = useReducedMotion();
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } } };
  const item = reduce
    ? { hidden: {}, visible: {} }
    : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-brand-blue pt-32 pb-28 text-ink sm:pt-36 lg:pt-44 lg:pb-36"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5.5rem))" }}
    >
      {/* Aster brand surface + faint ink dot-grid, rings & soft glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* faint dot-grid pattern, faded toward the edges */}
        <div className="absolute inset-0 bg-brand-dotgrid" />
        {/* abstract concentric rings (decorative geometry, behind the content) */}
        <div className="absolute -right-28 -top-24 h-[30rem] w-[30rem] rounded-full border border-ink/10" />
        <div className="absolute -right-10 top-16 h-72 w-72 rounded-full border border-ink/[0.08]" />
        <div className="absolute -left-20 bottom-4 h-64 w-64 rounded-full border border-ink/[0.07]" />
        {/* soft glows */}
        <div className="absolute -right-32 -top-28 h-[34rem] w-[34rem] rounded-full bg-ink/5 blur-3xl motion-safe:animate-[floatY_15s_ease-in-out_infinite]" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-ink/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-x-10 lg:gap-y-0">
          {/* A — copy (heading, paragraph, buttons) */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="lg:col-start-1 lg:row-start-1"
          >
            <motion.h1
              variants={item}
              className="text-[2.7rem] leading-[1.02] text-ink sm:text-[3.3rem] lg:text-[4rem] xl:text-[4.7rem]"
            >
              {copy.hero.headlineLead}{" "}
              <span>{copy.hero.headlineAccent}</span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
              {copy.hero.paragraph}
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" variant="bronze" size="lg" withArrow>
                {copy.hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="/services" variant="light" size="lg">
                {copy.hero.secondaryCta}
              </ButtonLink>
            </motion.div>
          </motion.div>

          {/* B — visual: a transparent cut-out (frameless on the blue, like the
              reference) when public/hero.png exists; otherwise the photo, framed.
              On mobile this sits ABOVE the review badges; on desktop it's the
              right column spanning both rows. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
            animate={reduce ? {} : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
            className="relative mx-auto w-full max-w-2xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none"
          >
            {cutoutSrc ? (
              <div className="relative">
                {/* soft glow so the cut-out sits naturally on the aster */}
                <div aria-hidden className="absolute inset-x-6 bottom-2 top-8 rounded-[45%] bg-white/40 blur-3xl" />
                <Image
                  src={cutoutSrc}
                  alt="MMR chartered accountant at work"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(min-width: 1024px) 50vw, 95vw"
                  className="relative h-auto w-full drop-shadow-2xl"
                />
              </div>
            ) : (
              <>
                {/* offset accent frame for depth + a bronze tie-in */}
                <div
                  aria-hidden
                  className="absolute -bottom-4 -right-4 hidden h-full w-full rounded-3xl border border-accent/40 sm:block"
                />
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-navy-700/20 ring-1 ring-ink/5">
                  <Image
                    src="/hero.jpg"
                    alt="An accountant reviewing financial dashboards at their desk"
                    width={1536}
                    height={1024}
                    priority
                    sizes="(min-width: 1024px) 48vw, 92vw"
                    className="h-auto w-full"
                  />
                </div>
              </>
            )}
          </motion.div>

          {/* C — review badges (Google + trust): beneath the picture on mobile,
              under the copy on desktop. */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-start-1 lg:row-start-2 lg:border-t lg:border-ink/15 lg:pt-7"
          >
            {/* Google reviews — white chip behind the G, text on the aster */}
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read our reviews on Google"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white shadow-lg shadow-navy-700/15">
                <GoogleG className="h-6 w-6" />
              </span>
              <div className="text-left">
                <p className="text-[0.78rem] font-semibold leading-none text-ink">Google Reviews</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-sm font-bold leading-none text-ink">{reviewsMeta.rating.score}</span>
                  <span className="flex items-center gap-0.5" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </span>
                  <span className="text-xs text-ink/60">({reviewsMeta.rating.count})</span>
                </div>
              </div>
            </a>
            <span className="hidden h-10 w-px bg-ink/20 sm:block" aria-hidden />
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <ShieldCheck className="h-5 w-5 text-accent" strokeWidth={1.75} aria-hidden />
              {copy.hero.badge}
            </span>
          </motion.div>
        </div>

      </Container>
    </section>
  );
}
