"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactDock } from "@/components/ContactDock";
import { SocialRail } from "@/components/SocialRail";
import { ScrollTop } from "@/components/ScrollTop";
import { RevealManager } from "@/components/RevealManager";

/**
 * Wraps the public site with its marketing chrome (header, footer, floating
 * docks, scroll-reveal manager). The CMS under /admin opts out entirely so it
 * renders as a clean, standalone app with its own layout.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <SocialRail />
      <ScrollTop />
      <ContactDock />
      {/* Re-runs scroll reveals on client-side navigation (the inline script
          in the root layout only fires on the initial document load). */}
      <RevealManager />
    </>
  );
}
