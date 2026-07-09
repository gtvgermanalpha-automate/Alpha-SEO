"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { smmProof } from "@/lib/portfolio";

/** Ring geometry (r=52 in a 120 viewBox). */
const R = 52;
const CIRC = 2 * Math.PI * R;

/**
 * "Insights & engagement proof" — animated, honest numbers (count-ups, a
 * non-follower reach ring, per-brand bars) beside the raw analytics
 * screenshots as receipts. All values come from smmProof (deck + client
 * analytics — never invented). Animations run once on scroll-into-view and
 * collapse to static values under prefers-reduced-motion.
 */
export function ProofPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();
  const on = inView || reduce; // reduced-motion shows final state immediately

  const maxFollowers = Math.max(...smmProof.perBrand.map((b) => b.followers));
  const maxPosts = Math.max(...smmProof.perBrand.map((b) => b.posts));
  const ringOffset = on ? CIRC * (1 - smmProof.nonFollowerPct / 100) : CIRC;

  return (
    <div className={`proof-grid${on ? " proof-on" : ""}`} ref={ref}>
      <div className="proof-panel">
        <div className="proof-tiles">
          <div className="proof-tile">
            <span className="proof-tile-num grad-num">
              <AnimatedCounter value={smmProof.views} />
            </span>
            <span className="proof-tile-label">Organic views in one tracked window</span>
          </div>
          <div className="proof-tile">
            <span className="proof-tile-num grad-num">
              <AnimatedCounter value={smmProof.reached} />
            </span>
            <span className="proof-tile-label">Accounts reached — one brand, no ad spend</span>
          </div>
        </div>

        <div
          className="proof-ring-row"
          role="img"
          aria-label={`${smmProof.nonFollowerPct}% of tracked views came from non-followers`}
        >
          <svg className="proof-ring" viewBox="0 0 120 120" aria-hidden focusable="false">
            <circle className="proof-ring-track" cx="60" cy="60" r={R} />
            <circle
              className="proof-ring-fg"
              cx="60"
              cy="60"
              r={R}
              strokeDasharray={CIRC}
              strokeDashoffset={ringOffset}
              transform="rotate(-90 60 60)"
            />
            <text className="proof-ring-num" x="60" y="57" textAnchor="middle">
              {smmProof.nonFollowerPct}%
            </text>
            <text className="proof-ring-sub" x="60" y="74" textAnchor="middle">
              non-followers
            </text>
          </svg>
          <p className="proof-ring-copy">
            <strong>{smmProof.nonFollowerPct}% of those views came from people who didn&apos;t follow the
            brand</strong> — the grid earned its reach through discovery, not ads.
          </p>
        </div>

        {(
          [
            { key: "followers", title: "Followers grown", max: maxFollowers },
            { key: "posts", title: "Posts designed & written", max: maxPosts },
          ] as const
        ).map((chart) => (
          <div className="proof-chart" key={chart.key}>
            <h4>{chart.title}</h4>
            {smmProof.perBrand.map((b, i) => {
              const value = chart.key === "followers" ? b.followers : b.posts;
              const display = chart.key === "followers" ? b.followersLabel : String(value);
              const pct = Math.round((value / chart.max) * 100);
              return (
                <div
                  className="proof-bar-row"
                  key={b.name}
                  title={`${b.name}: ${display} ${chart.title.toLowerCase()}`}
                >
                  <span className="proof-bar-label">
                    <span className="proof-dot" style={{ background: b.color }} aria-hidden />
                    {b.name}
                  </span>
                  <span className="proof-bar-track">
                    <span
                      className="proof-bar-fill"
                      style={{
                        width: on ? `${pct}%` : "0%",
                        background: b.color,
                        transitionDelay: on && !reduce ? `${0.15 + i * 0.12}s` : "0s",
                      }}
                    />
                  </span>
                  <span className="proof-bar-value">{display}</span>
                </div>
              );
            })}
          </div>
        ))}

        <p className="proof-footnote">
          Follower and post totals are per engagement, from the project decks; views and reach are from the
          client account&apos;s own analytics.
        </p>
      </div>

      <div className="proof-receipts">
        {smmProof.receipts.map((r) => (
          <figure className="phone-frame" key={r.src}>
            <span className="phone-frame-notch" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.src} alt={r.alt} loading="lazy" />
            <figcaption>{r.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
