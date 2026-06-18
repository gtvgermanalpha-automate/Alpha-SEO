import { ArrowRight } from "lucide-react";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "bronze" | "ghost" | "light";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-sans text-[0.7rem] font-semibold uppercase tracking-[0.13em] transition-colors duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const sizes = {
  md: "px-5 py-2.5",
  lg: "px-6 py-3",
};

const variants: Record<Variant, string> = {
  // Solid orange fill, white text — primary CTAs (darkens on hover).
  primary: "bg-bronze text-white hover:bg-bronze-600",
  // Solid orange fill — the prominent CTA.
  bronze: "bg-bronze text-white hover:bg-bronze-600",
  // Orange border + white fill + orange text; fills orange on hover — secondary.
  ghost: "border border-bronze bg-white text-ink hover:bg-bronze hover:text-white",
  // Secondary on the hero / dark surfaces: same white-fill + orange-border treatment.
  light: "border border-bronze bg-white text-ink hover:bg-bronze hover:text-white",
};

type ButtonLinkProps = ComponentProps<"a"> & {
  variant?: Variant;
  size?: keyof typeof sizes;
  withArrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
      {withArrow ? (
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      ) : null}
    </a>
  );
}
