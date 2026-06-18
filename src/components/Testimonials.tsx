"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GoogleG, GoogleWordmark, AccaLogo } from "@/components/ui/brands";
import { googleReviewsUrl, reviews, reviewsMeta } from "@/lib/content";

const avatarTones = [
  "from-[#24282b] to-[#16191b]",
  "from-[#1d66ba] to-[#d8472a]",
  "from-[#3a3f43] to-[#24282b]",
  "from-[#f47a60] to-[#1d66ba]",
  "from-[#4a5158] to-[#2f3438]",
  "from-[#1d66ba] to-[#b5381f]",
];

function GoldStars({ value = 5, className = "h-4 w-4" }: { value?: number; className?: string }) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${filled} out of 5`}>
      {Array.from({ length: 5 }).map((_, s) => (
        <svg key={s} viewBox="0 0 24 24" className={`${className} ${s < filled ? "fill-[#fbbc05]" : "fill-line"}`} aria-hidden>
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = reviewsMeta;
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-24 overflow-hidden border-b border-line bg-white py-20 sm:py-28"
      aria-label="Accreditations and client reviews"
    >
      <Container>
        {/* Single ACCA statement */}
        <Reveal className="mx-auto max-w-3xl px-3 text-center">
          <h2 className="text-balance font-display text-2xl font-bold leading-[1.32] text-ink sm:text-[1.95rem] sm:leading-snug lg:text-[2.25rem] lg:leading-[1.28]">
            {t.intro}
          </h2>
        </Reveal>

        {/* ACCA accreditation + relevant credentials */}
        <Reveal delay={0.05}>
          <div className="mt-11 flex flex-col items-center gap-5">
            <AccaLogo />
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {["Chartered Certified Accountants", "ACCA-regulated", "Fully insured", "Ethical oversight"].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-cream/60 px-3.5 py-1.5 text-xs font-semibold text-ink/70"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Rating summary — distinct horizontal card */}
        <Reveal delay={0.05} className="mt-14 flex justify-center">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-cream/50 px-8 py-5 text-center sm:flex-row sm:gap-7 sm:text-left">
            <div className="flex items-center gap-3">
              <span className="font-display text-[2.6rem] font-extrabold leading-none text-ink">{t.rating.score}</span>
              <div>
                <GoldStars className="h-[18px] w-[18px]" />
                <p className="mt-1 text-xs text-muted">out of {t.rating.outOf}</p>
              </div>
            </div>
            <span className="hidden h-12 w-px bg-line sm:block" aria-hidden />
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm leading-relaxed text-muted underline-offset-2 transition-colors hover:text-ink hover:underline"
            >
              from <span className="font-bold text-ink">{t.rating.count}</span> reviews on{" "}
              <GoogleWordmark className="align-middle text-base" />
            </a>
          </div>
        </Reveal>

        {/* Review cards */}
        <div className="relative mt-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            spaceBetween={24}
            slidesPerView={1}
            loop
            autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            style={
              {
                "--swiper-pagination-color": "#1d66ba",
                "--swiper-pagination-bullet-inactive-color": "#24282b",
                "--swiper-pagination-bullet-inactive-opacity": "0.18",
                "--swiper-pagination-bottom": "0px",
              } as React.CSSProperties
            }
            className="!pb-14 [&_.swiper-slide]:h-auto"
          >
            {reviews.map((rev, i) => (
              <SwiperSlide key={`${rev.name}-${i}`} className="h-auto">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {rev.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={rev.image}
                          alt={rev.name}
                          className="h-11 w-11 shrink-0 rounded-full border border-line object-cover"
                        />
                      ) : (
                        <span
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
                            avatarTones[i % avatarTones.length]
                          } font-display text-sm font-extrabold text-white`}
                          aria-hidden
                        >
                          {rev.initials}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold text-ink">{rev.name}</p>
                        <p className="text-xs text-muted">{rev.date}</p>
                      </div>
                    </div>
                    <GoogleG className="h-5 w-5 shrink-0" />
                  </div>
                  <div className="mt-3.5">
                    <GoldStars value={rev.rating} className="h-[18px] w-[18px]" />
                  </div>
                  <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">{rev.quote}</blockquote>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Carousel arrows — drive the Swiper instance directly */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous reviews"
            className="absolute -left-2 top-[42%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-md transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white sm:-left-5"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next reviews"
            className="absolute -right-2 top-[42%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-md transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white sm:-right-5"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </Container>
    </section>
  );
}
