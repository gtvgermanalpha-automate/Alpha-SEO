import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/content";

const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
const wa = "16473650782";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 16 14" /></svg>
);
const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.52 3.48A11.93 11.93 0 0 0 12.05 0C5.49 0 .14 5.34.14 11.91a11.86 11.86 0 0 0 1.6 5.95L0 24l6.31-1.66a11.93 11.93 0 0 0 5.74 1.46h.01c6.55 0 11.9-5.34 11.9-11.91a11.84 11.84 0 0 0-3.44-8.41z" /></svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

/** Contact page body — the form + a rich contact-info aside. Ported from the
 *  original static site (.contact-grid). */
export function Contact() {
  const office = siteConfig.offices[0];
  const address = office
    ? `${office.addressLine}, ${office.city}, ${office.postcode}`
    : `${siteConfig.contact.addressLine}, ${siteConfig.contact.city}, ${siteConfig.contact.postcode}`;

  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <ContactForm />

          <aside className="contact-info">
            <h3>Get in touch directly</h3>

            <div className="contact-block-rich">
              <div className="contact-block-icon"><MailIcon /></div>
              <div className="contact-block-content">
                <div className="contact-block-label">Email us</div>
                <a className="contact-block-value" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </div>
            </div>

            <div className="contact-block-rich">
              <div className="contact-block-icon"><PhoneIcon /></div>
              <div className="contact-block-content">
                <div className="contact-block-label">Call us</div>
                <a className="contact-block-value" href={telHref(siteConfig.contact.phone)}>{siteConfig.contact.phoneDisplay}</a>
              </div>
            </div>

            <div className="contact-block-rich">
              <div className="contact-block-icon"><PinIcon /></div>
              <div className="contact-block-content">
                <div className="contact-block-label">Visit us</div>
                <div className="contact-block-value">{address}</div>
              </div>
            </div>

            <div className="contact-block-rich">
              <div className="contact-block-icon whatsapp"><WhatsAppGlyph /></div>
              <div className="contact-block-content">
                <div className="contact-block-label">WhatsApp</div>
                <a className="contact-block-value" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">{siteConfig.contact.phoneDisplay}</a>
              </div>
            </div>

            <div className="contact-block-rich">
              <div className="contact-block-icon"><ClockIcon /></div>
              <div className="contact-block-content">
                <div className="contact-block-label">Response time</div>
                <div className="contact-block-value">{siteConfig.contact.hours}</div>
              </div>
            </div>

            <div className="contact-quick-actions">
              <a className="quick-action" href={`mailto:${siteConfig.contact.email}`} aria-label="Email"><MailIcon /><span>Email</span></a>
              <a className="quick-action whatsapp" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppGlyph /><span>Chat</span></a>
            </div>

            <div className="contact-trust">
              <div className="contact-trust-item"><Check /><span>NDA-ready engagements</span></div>
              <div className="contact-trust-item"><Check /><span>No high-pressure sales process</span></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
