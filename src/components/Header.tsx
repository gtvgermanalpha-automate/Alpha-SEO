"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LinkedInIcon, XIcon, WhatsAppIcon } from "@/components/ui/social";
import { navLinks, siteConfig } from "@/lib/content";

const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;

/** Site header — top utility bar + sticky nav with the Services mega-menu and the
 *  About dropdown. Faithful port of the original static site, wired to the CMS. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile drawer
  const [openMenu, setOpenMenu] = useState<string | null>(null); // mobile-expanded dropdown
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset the mobile drawer + any open dropdown on route change. Adjusting state
  // during render (React's recommended pattern for "reset on prop change") avoids
  // the cascading-render lint error you get from calling setState inside an effect.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(false);
    setOpenMenu(null);
  }

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const services = navLinks.find((l) => l.label === "Services");
  const megaItems = services?.mega?.flatMap((c) => c.items) ?? [];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* ── Top utility bar ── */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-hours">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></svg>
              {siteConfig.contact.hours}
            </span>
            <span className="topbar-divider" />
            <a href={telHref(siteConfig.contact.phone)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              {siteConfig.contact.phoneDisplay}
            </a>
            <span className="topbar-divider" />
            <a href={`mailto:${siteConfig.contact.email}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="topbar-right">
            <div className="topbar-social">
              <a href={siteConfig.social.linkedin || "#"} aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href={siteConfig.social.twitter || "#"} aria-label="X (Twitter)"><XIcon /></a>
              <a href="https://wa.me/16473650782" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
            </div>
            <span className="topbar-divider" />
            <Link className="topbar-cta" href="/contact">
              Get a free SEO audit
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Header / nav ── */}
      <header className={scrolled ? "scrolled" : undefined}>
        <div className="nav">
          <Link className="logo" href="/" aria-label="Alpha Digital Solutions — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="navbar-logo" src="/alpha-logo.png" alt="Alpha Digital Solutions logo" width={180} height={44} />
          </Link>

          <ul className={`nav-links${open ? " mobile-open" : ""}`}>
            <li>
              <Link href="/" className={isActive("/") ? "active" : undefined}>Home</Link>
            </li>

            {/* Services mega-menu */}
            <li className={`has-dropdown${openMenu === "services" ? " open" : ""}`}>
              <a
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={openMenu === "services"}
                className={isActive("/services") ? "active" : undefined}
                onClick={() => setOpenMenu((m) => (m === "services" ? null : "services"))}
              >
                Services
              </a>
              <div className="dropdown">
                <div className="dropdown-grid">
                  <div className="dropdown-head">
                    <span className="dropdown-head-title">Primary focus areas</span>
                    <span className="dropdown-head-sub">Five disciplines, one accountable team</span>
                  </div>
                  {megaItems.map((it) => {
                    const all = it.href === "/services";
                    return (
                      <Link key={it.href + it.title} href={it.href} className={`dropdown-item${all ? " dropdown-item-all" : ""}`}>
                        <div className="dropdown-item-icon"><Icon name={it.icon as IconName} /></div>
                        <div className="dropdown-item-text">
                          <span className="dropdown-item-title">{it.title}{all ? " →" : ""}</span>
                          <span className="dropdown-item-sub">{it.description}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </li>

            <li><Link href="/case-studies" className={isActive("/case-studies") ? "active" : undefined}>Case Studies</Link></li>
            <li><Link href="/blog" className={isActive("/blog") ? "active" : undefined}>Insights</Link></li>

            {/* About dropdown (compact) */}
            <li className={`has-dropdown has-dropdown-simple${openMenu === "about" ? " open" : ""}`}>
              <a
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={openMenu === "about"}
                className={isActive("/team") ? "active" : undefined}
                onClick={() => setOpenMenu((m) => (m === "about" ? null : "about"))}
              >
                About
              </a>
              <div className="dropdown dropdown-simple">
                <div className="dropdown-list">
                  <Link className="dropdown-link" href="/team">About Alpha</Link>
                  <Link className="dropdown-link" href="/how-we-work">Our Process</Link>
                  <Link className="dropdown-link" href="/contact">Contact</Link>
                </div>
              </div>
            </li>
          </ul>

          <div className="nav-cta">
            <Link className="btn btn-primary nav-cta-btn" href="/contact">Get in touch</Link>
            <button
              type="button"
              className={`menu-toggle${open ? " open" : ""}`}
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
