"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Clock, Menu, Phone, PhoneCall, Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { SiteSearch } from "@/components/SiteSearch";
import { Icon, type IconName } from "@/components/ui/Icon";
import { socialLinks } from "@/components/ui/social";
import { navLinks, siteConfig } from "@/lib/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  // Active mega-menu category is tracked PER menu (keyed by href). A single
  // shared index used to leak across menus: hovering the 3rd Services category
  // (index 2) then opening a 2-category menu evaluated `mega[2].items` →
  // crash. Keying by href keeps each menu's index in its own range.
  const [activeCat, setActiveCat] = useState<Record<string, number>>({});
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const phoneHref = `tel:${siteConfig.contact.phone.replace(/\s/g, "")}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Top utility bar (hides on scroll) */}
      <div
        className={`hidden overflow-hidden bg-ink text-white/75 transition-all duration-300 md:block ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <Container>
          <div className="flex h-10 items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-white/55 transition-colors hover:text-accent-400"
                >
                  <s.icon className="h-3.5 w-3.5" aria-hidden />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden items-center gap-1.5 text-white/55 lg:flex">
                <Clock className="h-3.5 w-3.5" aria-hidden /> {siteConfig.contact.hours}
              </span>
              <a href={phoneHref} className="flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-accent-400">
                <Phone className="h-3.5 w-3.5 text-accent-400" aria-hidden /> {siteConfig.contact.phoneDisplay}
              </a>
              <Link href="/contact" className="flex items-center gap-1.5 font-semibold text-accent-400 transition-colors hover:text-white">
                <PhoneCall className="h-3.5 w-3.5" aria-hidden /> Call Me Back
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main navigation */}
      <div
        className={`border-b bg-white transition-all duration-300 ${
          scrolled || open ? "border-line shadow-md shadow-ink/5" : "border-transparent"
        }`}
      >
        <Container>
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-[4.75rem]"}`}>
            <Link
              href="/"
              aria-label={`${siteConfig.name} home`}
              className="shrink-0"
              onClick={(e) => {
                setOpen(false);
                // On the home page a <Link href="/"> is a no-op, so scroll to
                // the top instead of appearing to do nothing.
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              {siteConfig.logoLinear ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={siteConfig.logoLinear}
                  alt={siteConfig.name}
                  className={`w-auto max-w-[62vw] object-contain transition-all duration-300 ${scrolled ? "h-6 sm:h-7" : "h-7 sm:h-8"}`}
                />
              ) : (
                <Logo size="md" />
              )}
            </Link>

            {/* Nav + quote button, grouped to the right (away from the logo) */}
            <div className="flex items-center gap-5 xl:gap-9">
            {/* Desktop nav with dropdowns */}
            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
              {navLinks.map((link, idx) => {
                const active = pathname === link.href;
                const alignRight = idx >= 2;

                // Plain links (no dropdown data) render normally.
                if (!link.children && !link.mega) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-2.5 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition-colors hover:text-accent ${
                        active ? "text-accent" : "text-ink/80"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                }

                // ── Safe mega-menu access ──────────────────────────────────
                // Guard against a category index that doesn't exist for THIS
                // menu (the cause of the crash). Falls back to 0 / [].
                const cats = link.mega ?? [];
                const rawCat = activeCat[link.href] ?? 0;
                const currentCat = rawCat >= 0 && rawCat < cats.length ? rawCat : 0;
                const megaItems = cats[currentCat]?.items ?? [];

                return (
                  <div key={link.href} className="group relative">
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-2.5 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.06em] transition-colors hover:text-accent ${
                        active ? "text-accent" : "text-ink/80"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:rotate-180" aria-hidden />
                    </Link>
                    <div
                      className={`invisible absolute top-full translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
                        alignRight ? "right-0" : "left-0"
                      }`}
                    >
                      {link.mega ? (
                        <div className="flex w-[600px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-ink/10 xl:w-[700px]">
                          <ul className="w-60 shrink-0 space-y-1 border-r border-line bg-cream/40 p-3">
                            {cats.map((cat, i) => (
                              <li key={cat.label}>
                                <button
                                  type="button"
                                  onMouseEnter={() => setActiveCat((prev) => ({ ...prev, [link.href]: i }))}
                                  onFocus={() => setActiveCat((prev) => ({ ...prev, [link.href]: i }))}
                                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                                    currentCat === i ? "bg-white text-accent shadow-sm" : "text-ink/75 hover:bg-white/70"
                                  }`}
                                >
                                  <span
                                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                                      currentCat === i ? "bg-ink text-white" : "bg-white text-accent ring-1 ring-line"
                                    }`}
                                  >
                                    <Icon name={cat.icon as IconName} className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                                  </span>
                                  <span className="flex-1">{cat.label}</span>
                                  <ChevronRight
                                    className={`h-4 w-4 shrink-0 transition-opacity ${currentCat === i ? "text-accent opacity-100" : "opacity-0"}`}
                                    aria-hidden
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                          <div className="grid flex-1 grid-cols-2 gap-1 p-3">
                            {megaItems.map((it) => (
                              <Link
                                key={it.title}
                                href={it.href}
                                className="group/i flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-cream"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue text-accent transition-colors group-hover/i:bg-ink group-hover/i:text-white">
                                  <Icon name={it.icon as IconName} className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-semibold text-ink">{it.title}</span>
                                  <span className="mt-0.5 block text-xs leading-snug text-muted">{it.description}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <ul className="w-72 rounded-xl border border-line bg-white p-2 shadow-xl shadow-ink/10">
                          {(link.children ?? []).map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-cream hover:text-accent"
                              >
                                <span className="h-1 w-1 shrink-0 bg-accent" aria-hidden />
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:block">
              <SiteSearch variant="icon" />
            </div>

            <div className="hidden items-center gap-3 xl:flex">
              <ButtonLink href="/contact" variant="primary" withArrow>
                Get a Quote
              </ButtonLink>
            </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
          >
            <Container className="py-4">
              <div className="pb-4">
                <SiteSearch variant="inline" onNavigate={() => setOpen(false)} />
              </div>
              <nav className="flex flex-col divide-y divide-line" aria-label="Mobile">
                {navLinks.map((link) => {
                  // Flatten mega categories → items; fall back to children; guard
                  // every level so a missing `items`/`children` can't crash.
                  const subItems = link.mega
                    ? link.mega.flatMap((c) => (c.items ?? []).map((it) => ({ label: it.title, href: it.href })))
                    : link.children ?? [];
                  const hasSub = subItems.length > 0;
                  return (
                    <div key={link.href} className="py-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="py-3 text-sm font-semibold uppercase tracking-[0.08em] text-ink"
                        >
                          {link.label}
                        </Link>
                        {hasSub && (
                          <button
                            type="button"
                            aria-label={`Toggle ${link.label} submenu`}
                            aria-expanded={openSub === link.href}
                            onClick={() => setOpenSub(openSub === link.href ? null : link.href)}
                            className="grid h-9 w-9 place-items-center text-accent"
                          >
                            <Plus className={`h-4 w-4 transition-transform duration-300 ${openSub === link.href ? "rotate-45" : ""}`} />
                          </button>
                        )}
                      </div>
                      <AnimatePresence initial={false}>
                        {hasSub && openSub === link.href && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden pb-2 pl-3"
                          >
                            {subItems.map((child, ci) => (
                              <li key={`${link.href}-${ci}`}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className="flex items-center gap-2.5 py-2.5 text-sm text-ink/75"
                                >
                                  <span className="h-1 w-1 shrink-0 bg-accent" aria-hidden />
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <div className="flex flex-col gap-4 pt-5">
                  <a href={phoneHref} className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <Phone className="h-4 w-4 text-accent" aria-hidden /> {siteConfig.contact.phoneDisplay}
                  </a>
                  <ButtonLink href="/contact" variant="primary" withArrow onClick={() => setOpen(false)} className="w-full">
                    Get a Quote
                  </ButtonLink>
                  <div className="flex items-center gap-3 pt-1">
                    {socialLinks.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-ink/45 hover:text-accent">
                        <s.icon className="h-4 w-4" aria-hidden />
                      </a>
                    ))}
                  </div>
                </div>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
