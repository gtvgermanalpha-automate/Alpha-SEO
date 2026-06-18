import Link from "next/link";
import { type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SpotArt, type Name as SpotArtName } from "@/components/ui/SpotArt";
import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * Banner header for sub-pages — a brand-blue hero that mirrors the home page:
 * blue gradient + faint dot-grid + concentric rings + soft glows, with a
 * breadcrumb, title and subtitle in white, and an optional relevant
 * illustration (SpotArt) or icon floated on the right (desktop).
 */
export function PageHero({
  title,
  subtitle,
  crumb,
  parent,
  illus,
  art,
  icon,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  crumb: string;
  /** Optional middle breadcrumb (e.g. Home / Services / This page). */
  parent?: { label: string; href: string };
  /** Optional recoloured header illustration at public/illustrations/<illus>.svg. */
  illus?: string;
  /** Optional spot illustration floated on the right (desktop only). */
  art?: SpotArtName;
  /** Optional icon visual (used when no illustration fits the page). */
  icon?: IconName;
}) {
  const hasVisual = Boolean(illus || art || icon);

  return (
    <section className="relative overflow-hidden bg-brand-blue pt-32 pb-20 text-white sm:pt-36 sm:pb-24 lg:pt-40">
      {/* Blue-surface decorations — matches the home hero (dot-grid, rings, glows) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-brand-dotgrid" />
        <div className="absolute -right-28 -top-24 h-[30rem] w-[30rem] rounded-full border border-white/10" />
        <div className="absolute -right-10 top-16 h-72 w-72 rounded-full border border-white/[0.08]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full border border-white/[0.06]" />
        <div className="absolute -right-32 -top-28 h-[34rem] w-[34rem] rounded-full bg-white/10 blur-3xl motion-safe:animate-[floatY_15s_ease-in-out_infinite]" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className={hasVisual ? "grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14" : ""}>
          <Reveal>
            <nav
              className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
              aria-label="Breadcrumb"
            >
              <Link href="/" className="text-white/65 transition-colors hover:text-white">
                Home
              </Link>
              <span className="text-blue-300" aria-hidden>
                /
              </span>
              {parent ? (
                <>
                  <Link href={parent.href} className="text-white/65 transition-colors hover:text-white">
                    {parent.label}
                  </Link>
                  <span className="text-blue-300" aria-hidden>
                    /
                  </span>
                </>
              ) : null}
              <span className="text-white">{crumb}</span>
            </nav>

            <h1 className="mt-7 max-w-3xl text-4xl text-white sm:text-5xl lg:text-[3.1rem] lg:leading-[1.08]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{subtitle}</p>
            ) : null}
          </Reveal>

          {hasVisual ? (
            <Reveal delay={0.12} className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                {/* soft glow so the card sits naturally on the blue */}
                <div aria-hidden className="absolute -inset-6 rounded-[45%] bg-white/15 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-navy-700/40 ring-1 ring-white/15">
                  {illus ? (
                    <div className="relative aspect-[4/3] bg-white p-6 sm:p-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/illustrations/${illus}.svg`} alt="" className="h-full w-full object-contain" />
                    </div>
                  ) : art ? (
                    <SpotArt name={art} />
                  ) : (
                    <div className="relative aspect-[220/180] bg-blue">
                      {/* accent dots echo the spot-illustration style */}
                      <span className="absolute right-8 top-8 h-3 w-3 rounded-full bg-accent/50" aria-hidden />
                      <span className="absolute left-8 bottom-8 h-2.5 w-2.5 rounded-full bg-ink/10" aria-hidden />
                      <div className="grid h-full w-full place-items-center">
                        <Icon name={icon!} className="h-24 w-24 text-accent" strokeWidth={1.3} aria-hidden />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
