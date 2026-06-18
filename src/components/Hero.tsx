"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";
import { easeOut } from "@/lib/motion";

const pillars = ["Fixed monthly fees", "Your own accountant", "Switch in days"];
const chart = [
  [0, 116],
  [44, 96],
  [88, 104],
  [132, 70],
  [176, 78],
  [220, 44],
  [264, 56],
  [320, 22],
];

export function Hero() {
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
    <section id="home" className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
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

            <motion.ul
              variants={item}
              className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2"
            >
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

          {/* Statement card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <StatementCard reduce={!!reduce} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

function StatementCard({ reduce }: { reduce: boolean }) {
  const line = chart.map((p) => p.join(",")).join(" ");
  const last = chart[chart.length - 1];

  return (
    <div className="border border-ink bg-white p-7 sm:p-8">
      {/* Letterhead row */}
      <div className="flex items-center justify-between">
        <LogoMark className="text-xl" />
        <span className="eyebrow text-muted">FY 2025</span>
      </div>

      <div className="mt-5 h-px w-full bg-bronze" />

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="eyebrow text-muted">Net profit · YTD</p>
          <p className="mt-2 font-display text-4xl text-ink">£128,400</p>
        </div>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-bronze">
          +18%
        </span>
      </div>

      {/* Monochrome line chart (stroke only — no fill, no shade) */}
      <svg viewBox="0 0 320 130" className="mt-6 h-28 w-full" role="img" aria-label="Net profit trending upward">
        <motion.polyline
          points={line}
          fill="none"
          stroke="#24282b"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={reduce ? {} : { pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: easeOut }}
        />
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="#ee5935" />
      </svg>

      <div className="mt-6 divide-y divide-line border-y border-line">
        <Row label="Tax saved · YTD" value="£4,620" />
        <Row label="Next VAT due" value="7 Aug 2025" />
      </div>

      {/* Signature */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="font-display text-lg italic text-ink">MMR Accountants</p>
          <p className="eyebrow mt-1 text-muted">Chartered Practice</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-bronze text-[0.6rem] font-semibold uppercase tracking-wider text-bronze">
          Seal
        </span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-display text-base text-ink">{value}</span>
    </div>
  );
}
