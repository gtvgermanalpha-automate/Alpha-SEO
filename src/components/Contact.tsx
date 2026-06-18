import { Clock, Mail, MapPin, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { copy, siteConfig } from "@/lib/content";

type ContactRow = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  sub?: { text: string; href: string };
};

export function Contact() {
  const telHref = (p: string) => `tel:${p.replace(/\s/g, "")}`;
  const details: ContactRow[] = [
    ...siteConfig.offices.map((o) => ({
      icon: MapPin,
      label: `${o.city} office`,
      value: `${o.addressLine}, ${o.city}, ${o.postcode}`,
      sub: { text: o.phoneDisplay, href: telHref(o.phone) },
    })),
    { icon: Mail, label: copy.contact.labels.email, value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Clock, label: copy.contact.labels.hours, value: siteConfig.contact.hours },
  ];

  return (
    <section id="contact" className="relative scroll-mt-24 border-t border-line bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Info */}
          <div>
            <Reveal>
              <span className="flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden />
                <span className="eyebrow">{copy.contact.eyebrow}</span>
              </span>
              <h2 className="mt-5 text-3xl text-ink sm:text-4xl lg:text-[2.6rem] lg:leading-[1.12]">
                {copy.contact.title}
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{copy.contact.subtitle}</p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-9 divide-y divide-line border-y border-line">
                {details.map((d) => (
                  <li key={d.label} className="flex items-start gap-4 py-5">
                    <d.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.4} aria-hidden />
                    <div>
                      <p className="eyebrow text-muted">{d.label}</p>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="mt-1 block text-base font-semibold text-ink transition-colors hover:text-accent"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-base font-semibold text-ink">{d.value}</p>
                      )}
                      {d.sub ? (
                        <a
                          href={d.sub.href}
                          className="mt-1.5 inline-block text-sm font-bold text-accent transition-colors hover:text-ink"
                        >
                          {d.sub.text}
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-8 inline-flex items-center gap-2.5 border border-accent px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="eyebrow text-accent">{copy.contact.accepting}</span>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.06} y={28}>
            <ContactForm />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
