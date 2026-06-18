"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { BackgroundFX } from "@/components/ui/BackgroundFX";
import { stats } from "@/lib/content";

export function Statistics() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 });

  return (
    <section className="relative overflow-hidden border-b border-line bg-white py-20 sm:py-24" aria-label="Key statistics">
      <BackgroundFX variant="subtle" />
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow text-bronze">By the numbers</span>
          <h2 className="mt-4 text-3xl text-ink sm:text-4xl">
            Trusted by businesses that expect results
          </h2>
        </Reveal>

        <div ref={ref} className="mt-14 grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={`px-4 text-center ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
            >
              <div className="font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
                {inView ? (
                  reduce ? (
                    <span>
                      {s.end.toLocaleString("en-GB")}
                      {s.suffix}
                    </span>
                  ) : (
                    <CountUp end={s.end} duration={2.4} separator="," suffix={s.suffix} />
                  )
                ) : (
                  <span>0{s.suffix}</span>
                )}
              </div>
              <span className="mx-auto mt-4 block h-px w-10 bg-bronze" aria-hidden />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.1em] text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
