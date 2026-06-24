import Link from "next/link";
import { LinkedInIcon, XIcon, WhatsAppIcon } from "@/components/ui/social";
import { copy, services, siteConfig } from "@/lib/content";

const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;

/** Site footer — faithful port of the original static site, wired to the CMS. */
export function Footer() {
  const year = new Date().getFullYear();
  const office = siteConfig.offices[0];
  const address = office
    ? `${office.addressLine}, ${office.city}, ${office.postcode}`
    : `${siteConfig.contact.addressLine}, ${siteConfig.contact.city}, ${siteConfig.contact.postcode}`;

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="navbar-logo footer-logo" src={siteConfig.logoCircular || siteConfig.logoLinear || "/alpha-logo.png"} alt={`${siteConfig.name} logo`} width={149} height={54} loading="lazy" />
            </div>
            <p>{copy.footer.blurb}</p>
            <ul className="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{address}</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <a href={telHref(siteConfig.contact.phone)}>{siteConfig.contact.phoneDisplay}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>

          <nav className="footer-col" aria-label="SEO Pillars">
            <h4>{copy.footer.columns.services}</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.title}</Link></li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Company">
            <h4>{copy.footer.columns.quickLinks}</h4>
            <ul>
              <li><Link href="/team">About</Link></li>
              <li><Link href="/how-we-work">Process</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/blog">Insights</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Connect">
            <h4>Connect</h4>
            <ul>
              <li><a href={siteConfig.social.linkedin || "#"} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href={siteConfig.social.twitter || "#"} target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
              <li><a href="https://wa.me/16473650782" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><Link href="/blog">RSS · Insights</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <div>© {year} {siteConfig.name}. All rights reserved.</div>
          <div className="social-links">
            <a href={siteConfig.social.linkedin || "#"} aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href={siteConfig.social.twitter || "#"} aria-label="X / Twitter"><XIcon /></a>
            <a href="https://wa.me/16473650782" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
