import Link from "next/link";
import { Clock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { socialLinks } from "@/components/ui/social";
import { copy, legalPages, navLinks, services, siteConfig } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  // The header nav is intentionally compact — Team and FAQ are nested into
  // dropdowns there. The footer stays a full directory, so it lists the
  // top-level pages (CMS-driven) plus those nested pages, flat.
  const quickLinks = [
    ...navLinks.map((l) => ({ label: l.label, href: l.href })),
    { label: "Team", href: "/team" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden bg-brand-blue-deep text-ink/80">
      {/* faint ink dot-grid + soft glows, fading down from the top */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-brand-dotgrid"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 55%)",
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 55%)",
          }}
        />
        <div className="absolute -right-32 -top-28 h-[28rem] w-[28rem] rounded-full border border-ink/[0.08]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ink/5 blur-3xl" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-ink/5 blur-3xl" />
      </div>
      <Container className="relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            {siteConfig.logoLinear ? (
              // eslint-disable-next-line @next/next/no-img-element
              <span className="inline-flex rounded-lg bg-white px-3.5 py-2 shadow-sm">
                <img src={siteConfig.logoLinear} alt={siteConfig.name} className="h-7 w-auto object-contain sm:h-8" />
              </span>
            ) : (
              <Logo tone="dark" size="md" />
            )}
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/80">{copy.footer.blurb}</p>
            <div className="mt-7">
              <ButtonLink href="/contact" variant="bronze" withArrow>
                {copy.footer.cta}
              </ButtonLink>
            </div>
            <div className="mt-7 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-lg bg-ink/5 text-ink/70 ring-1 ring-ink/10 transition-all duration-300 hover:bg-accent hover:text-white hover:ring-accent"
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h2 className="text-[0.95rem] font-extrabold uppercase tracking-[0.14em] text-ink">{copy.footer.columns.services}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {services.map((s) => (
                <li key={s.title}>
                  <Link href={`/services#${s.slug}`} className="text-ink/80 transition-colors hover:text-ink">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <h2 className="text-[0.95rem] font-extrabold uppercase tracking-[0.14em] text-ink">{copy.footer.columns.quickLinks}</h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink/80 transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-[0.95rem] font-extrabold uppercase tracking-[0.14em] text-ink">{copy.footer.columns.contact}</h2>
            <ul className="mt-5 flex flex-col gap-5 text-sm">
              {siteConfig.offices.map((o) => (
                <li key={o.city} className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="font-semibold text-ink">{o.city}</p>
                    <p className="mt-0.5 text-ink/80">{o.addressLine}, {o.postcode}</p>
                    <a
                      href={`tel:${o.phone.replace(/\s/g, "")}`}
                      className="mt-1 inline-block text-ink/80 transition-colors hover:text-ink"
                    >
                      {o.phoneDisplay}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <a href={`mailto:${siteConfig.contact.email}`} className="break-all text-ink/80 transition-colors hover:text-ink">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="text-ink/80">{siteConfig.contact.hours}</p>
                  <p className="mt-0.5 font-semibold text-ink">24/7 support for clients</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-14 border-t border-ink/10 pt-8 text-xs leading-relaxed text-ink/75">
          <p className="max-w-4xl">
            {siteConfig.name} is an SEO &amp; digital marketing agency based in Toronto, Ontario, Canada.{" "}
            {copy.footer.disclaimer}
          </p>
          <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p>© {year} {siteConfig.name}. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {legalPages.map((p) => (
                <Link key={p.slug} href={`/${p.slug}`} className="transition-colors hover:text-ink">
                  {p.crumb}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
