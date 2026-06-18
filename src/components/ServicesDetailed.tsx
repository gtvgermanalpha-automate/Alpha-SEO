import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SpotArt } from "@/components/ui/SpotArt";
import { ButtonLink } from "@/components/ui/Button";
import { DotCluster } from "@/components/ui/Decorations";
import { services } from "@/lib/content";

/** Alternating illustration + content for each service (used on the /services page). */
export function ServicesDetailed() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-20 lg:gap-28">
          {services.map((service, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={service.slug}
                id={service.slug}
                className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                {/* Illustration */}
                <Reveal className={reversed ? "lg:order-2" : ""} y={20}>
                  <div className="relative mx-auto max-w-md">
                    <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-accent/10 blur-2xl" aria-hidden />
                    <DotCluster className="absolute -right-4 -top-6 hidden h-14 w-14 opacity-50 sm:block" />
                    <div className="rounded-3xl border border-line bg-cream p-8 shadow-sm">
                      <SpotArt name={service.art} className="mx-auto max-w-[280px]" />
                    </div>
                  </div>
                </Reveal>

                {/* Content */}
                <Reveal className={reversed ? "lg:order-1" : ""} y={24}>
                  <span className="eyebrow text-accent">Service {String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-3 text-3xl text-ink sm:text-4xl">{service.title}</h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{service.description}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-ink/80">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-50 text-accent">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <ButtonLink href={`/services/${service.slug}`} variant="primary" withArrow>
                      Learn more
                    </ButtonLink>
                    <ButtonLink href="/contact" variant="ghost">
                      Get a Quote
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
