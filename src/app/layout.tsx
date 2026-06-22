import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { siteConfig } from "@/lib/content";
import { SiteChrome } from "@/components/SiteChrome";
import { jsonLd } from "@/lib/jsonLd";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium SEO Agency in Toronto`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "SEO agency Toronto",
    "technical SEO",
    "on-page SEO",
    "off-page SEO",
    "link building",
    "local SEO",
    "SEO audit",
    "content strategy",
    "Core Web Vitals",
    "Answer Engine Optimisation",
    "organic growth",
    "Alpha Digital Solutions",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Premium SEO Agency in Toronto`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium SEO Agency in Toronto`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "Marketing",
};

export const viewport: Viewport = {
  themeColor: "#f4f1ec",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  image: `${siteConfig.url}/opengraph-image`,
  ...(siteConfig.logoLinear
    ? { logo: { "@type": "ImageObject", url: `${siteConfig.url}${siteConfig.logoLinear}` } }
    : {}),
  priceRange: "$$$",
  areaServed: ["CA", "US", "GB", "AU"],
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.addressLine,
    addressLocality: siteConfig.contact.city,
    addressRegion: "ON",
    postalCode: siteConfig.contact.postcode,
    addressCountry: "CA",
  },
  geo: { "@type": "GeoCoordinates", latitude: 43.6532, longitude: -79.3832 },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  knowsAbout: [
    "Technical SEO",
    "On-Page SEO & Content",
    "Off-Page SEO & Link Building",
    "Local SEO",
    "Reddit & Community Visibility",
    "Answer Engine Optimisation",
  ],
  sameAs: Object.values(siteConfig.social).filter(Boolean),
};

// WebSite + SearchAction enables the Google Sitelinks Search Box (eligibility is
// Google's call; this is the markup + a working /search?q= endpoint we control).
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${montserrat.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white text-ink">
        {/* Mark JS as available before content paints, so CSS scroll-reveals
            stay hidden only when they can actually be animated (no flash, and
            content is visible if JS is off). */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteSchema) }}
        />
        {/* Scroll reveals — plain vanilla (not a React effect), so it runs the
            same way it does on the working reference site and on iOS Safari.
            IntersectionObserver toggles .is-visible; setTimeout is a hard
            fallback so nothing ever stays hidden / un-animated. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var S='[data-reveal],[data-reveal-stagger],[data-reveal-line]';function r(e){e.classList.add('is-visible')}function init(){var els=[].slice.call(document.querySelectorAll(S));if(!els.length)return;if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){r(x.target);io.unobserve(x.target)}})},{threshold:0.14,rootMargin:'0px 0px -40px 0px'});els.forEach(function(e){io.observe(e)})}else{els.forEach(r);return}function sweep(){var vh=window.innerHeight;els.forEach(function(e){if(!e.classList.contains('is-visible')&&e.getBoundingClientRect().top<vh*0.9)r(e)})}var t=false;window.addEventListener('scroll',function(){if(t)return;t=true;requestAnimationFrame(function(){sweep();t=false})},{passive:true});sweep();setTimeout(sweep,1500)}document.readyState!=='loading'?init():document.addEventListener('DOMContentLoaded',init)})();",
          }}
        />
      </body>
    </html>
  );
}
