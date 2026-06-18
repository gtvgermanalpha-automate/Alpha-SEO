/**
 * Fixed vertical "Get a Quote" tab on the right edge (desktop only).
 * A recognisable premium-services side button; links to the contact page.
 */
export function QuoteTab() {
  return (
    <a
      href="/contact"
      aria-label="Get a quote"
      className="group fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <span className="flex items-center bg-ink px-2.5 py-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors duration-300 [writing-mode:vertical-rl] group-hover:bg-bronze">
        Get a Quote
      </span>
    </a>
  );
}
