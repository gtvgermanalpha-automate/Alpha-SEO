"use client";

import { useCallback, useEffect, useRef } from "react";
import { GoogleG } from "@/components/ui/brands";
import { googleReviewsUrl, reviews, reviewsMeta } from "@/lib/content";

const Star = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);

/** Client testimonials — a draggable, auto-advancing card carousel with a Google
 *  rating mark and prev/next controls. Uses initials avatars (names withheld at
 *  client request — no stock faces). Ported from the original static site. */
export function Testimonials() {
  const carRef = useRef<HTMLDivElement>(null);

  // Pointer drag-to-scroll.
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;
    let down = false, startX = 0, startScroll = 0;
    const onDown = (e: PointerEvent) => { down = true; startX = e.clientX; startScroll = el.scrollLeft; el.classList.add("dragging"); };
    const onMove = (e: PointerEvent) => { if (down) el.scrollLeft = startScroll - (e.clientX - startX); };
    const onUp = () => { down = false; el.classList.remove("dragging"); };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Autoplay — gated by prefers-reduced-motion, paused on hover.
  useEffect(() => {
    const el = carRef.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let paused = false;
    const pause = () => { paused = true; };
    const play = () => { paused = false; };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", play);
    const id = window.setInterval(() => {
      if (paused) return;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
    }, 4500);
    return () => {
      window.clearInterval(id);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", play);
    };
  }, []);

  const nudge = useCallback((dir: number) => {
    const el = carRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".review");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return (
    <section className="section section-soft" id="testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{reviewsMeta.eyebrow}</span>
          <h2>What partners say after working with us for <span className="highlight">12+ months</span></h2>
          <div className="reviews-rating">
            <span className="reviews-g"><GoogleG /></span>
            <span className="reviews-stars">★★★★★</span>
            <a className="reviews-rating-text" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Reviewed by our clients on Google</a>
          </div>
        </div>
      </div>

      <div className="reviews-carousel" ref={carRef} aria-roledescription="carousel" aria-label="Client testimonials">
        <div className="reviews-track">
          {reviews.map((r, i) => (
            <div className="review" key={`${r.name}-${i}`}>
              <div className="review-stars">{Array.from({ length: 5 }).map((_, s) => <Star key={s} />)}</div>
              <p>{r.quote}</p>
              <div className="review-author">
                <div className="review-avatar review-avatar-initials" aria-hidden="true">{r.initials}</div>
                <div className="review-author-info">
                  <span className="review-author-name">{r.name}</span>
                  <span className="review-author-role">{r.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="reviews-controls">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous reviews">&#8249;</button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next reviews">&#8250;</button>
        </div>
        <p className="reviews-note">{reviewsMeta.intro}</p>
      </div>
    </section>
  );
}
