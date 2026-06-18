import { type ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <Reveal
      className={`flex flex-col ${
        isCenter ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      <span className="flex items-center gap-3 text-accent">
        <span className="h-px w-8 bg-accent" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
        {isCenter && <span className="h-px w-8 bg-accent" aria-hidden />}
      </span>
      <h2 className="mt-5 max-w-3xl text-balance text-[2.1rem] text-ink sm:text-[2.55rem] lg:text-[3.15rem] lg:leading-[1.08]">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-5 text-base leading-relaxed text-muted sm:text-lg ${
            isCenter ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
