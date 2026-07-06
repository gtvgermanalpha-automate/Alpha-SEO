/**
 * Portfolio projects shown on /portfolio/social-media-marketing. Social-media +
 * brand design work, sourced from the supplied portfolio deck (project details +
 * design visuals only — no personal attribution). Plain data module (not
 * CMS-managed yet). All metrics are real numbers from the deck / client
 * analytics — never invent new ones.
 */
export type PortfolioMetric = { value: string; label: string };

/** One design visual in a project's gallery grid. Default tiles are 4:5;
 *  "tall" = full-feed phone screenshot (spans two rows); "wide" = landscape. */
export type PortfolioDesign = {
  src: string;
  alt: string;
  layout?: "tall" | "wide";
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  image: string;
  imageAlt: string;
  summary: string;
  metrics: PortfolioMetric[];
  highlights: string[];
  /** Gallery of real designs from the deck, shown as a grid under the details. */
  designs: PortfolioDesign[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "evolution-magazine",
    title: "Evolution Magazine",
    category: "Social Media Design & Content",
    image: "/portfolio/evolution-magazine.webp",
    imageAlt: "Evolution Magazine social post — a dark, editorial 'Business · Evolution' design",
    summary:
      "End-to-end social for a gaming magazine — every post designed from scratch, and every caption researched and written in-house, all aligned to the brand's aesthetic and the world its readers live in.",
    metrics: [
      { value: "23.7K", label: "Followers" },
      { value: "949", label: "Posts designed" },
    ],
    highlights: [
      "Encircled imagery to focus attention and keep the feed clean and neat",
      "Logo and asset overlaps that make key visuals pop off the grid",
      "Clean, on-aesthetic backgrounds that give a true video-game feel",
      "Research and copywriting for every post — not just the design",
    ],
    designs: [
      { src: "/portfolio/evolution-tile-02.webp", alt: "Evolution Magazine 'AI · Evolution' post — Pakistan joins the global AI race" },
      { src: "/portfolio/evolution-post-01.webp", alt: "Evolution Magazine editorial social post design" },
      { src: "/portfolio/evolution-tile-03.webp", alt: "Evolution Magazine social post design" },
      { src: "/portfolio/evolution-tile-04.webp", alt: "Evolution Magazine social post design" },
      { src: "/portfolio/evolution-post-02.webp", alt: "Evolution Magazine editorial social post design" },
      { src: "/portfolio/evolution-tile-05.webp", alt: "Evolution Magazine social post design" },
      { src: "/portfolio/evolution-tile-07.webp", alt: "Evolution Magazine social post design" },
      { src: "/portfolio/evolution-post-03.webp", alt: "Evolution Magazine editorial social post design" },
      { src: "/portfolio/evolution-tile-08.webp", alt: "Evolution Magazine social post design" },
    ],
  },
  {
    slug: "elevon-pakistan",
    title: "Elevon Pakistan",
    category: "Social Media Design",
    image: "/portfolio/elevon-pakistan.webp",
    imageAlt: "Elevon social post — a bold cricket World Cup design",
    summary:
      "Full social media design for a community brand — ideation, colour tones and a grid built from scratch to match the brand's energy and make the feed instantly recognisable.",
    metrics: [
      { value: "3,550", label: "Followers" },
      { value: "193", label: "Posts designed" },
    ],
    highlights: [
      "A custom grid with a subtle transparent texture for an ownable, unique look",
      "Bold, attention-grabbing posts that pull the eye straight to the message",
      "Grid sequencing designed to make people want to see what's next",
    ],
    designs: [
      { src: "/portfolio/elevon-feed-01.webp", alt: "Elevon Pakistan Instagram feed — the cohesive custom grid, zoomed out", layout: "tall" },
      { src: "/portfolio/elevon-tile-01.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-tile-02.webp", alt: "Elevon Pakistan post — 4 most dreamiest cafes in Islamabad" },
      { src: "/portfolio/elevon-post-01.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-tile-04.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-feed-02.webp", alt: "Elevon Pakistan Instagram feed — grid sequencing across rows", layout: "tall" },
      { src: "/portfolio/elevon-post-02.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-tile-06.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-post-03.webp", alt: "Elevon Pakistan social post design" },
      { src: "/portfolio/elevon-tile-07.webp", alt: "Elevon Pakistan social post design" },
    ],
  },
  {
    slug: "pstve-glo",
    title: "Pstve Glo",
    category: "Brand Design",
    image: "/portfolio/pstve-glo.webp",
    imageAlt: "Pstve Glo scented-candle post carrying the brand's 'you need a reset' line",
    summary:
      "A full brand identity and aesthetic Instagram grid for a candle brand — highlights, layout and visuals all aligned to a calm 'a need to reset' feeling. Organic content reached far beyond the brand's own followers: 41K+ views, 98.7% of them from non-followers.",
    metrics: [
      { value: "41K+", label: "Views · 98.7% non-followers" },
      { value: "19.9K", label: "Accounts reached" },
    ],
    highlights: [
      "Highlight covers designed and aligned to the brand's identity",
      "A fully set, cohesive Instagram grid for the brand",
      "Calm, considered visuals that carry the 'need to reset' message",
      "Discovery-driven reach — 98.7% of tracked views came from non-followers",
    ],
    designs: [
      { src: "/portfolio/pstve-feed-01.webp", alt: "Pstve Glo Instagram profile — cohesive brand grid and highlight covers", layout: "tall" },
      { src: "/portfolio/pstve-analytics-01.webp", alt: "Instagram analytics — 41,177 views, 98.7% from non-followers, 19,913 accounts reached" },
      { src: "/portfolio/pstve-feed-02.webp", alt: "Pstve Glo Instagram feed — the full grid, zoomed out", layout: "tall" },
    ],
  },
  {
    slug: "glow-workshop",
    title: "Glow Workshop",
    category: "Event & Promo Design",
    image: "/portfolio/glow-01.webp",
    imageAlt: "Glow Workshop event promo — neon glow-paint visuals with date, session slots and venue",
    summary:
      "Promotional campaign design for a glow-paint art workshop — a neon visual language built from the event's own artwork, a clear date / slots / venue hierarchy, and a consistent call-to-action carried across formats.",
    metrics: [
      { value: "Event", label: "Campaign design" },
      { value: "2", label: "Promo formats" },
    ],
    highlights: [
      "Neon visual language built from the workshop's own glow artwork",
      "Date, session-slot and venue hierarchy designed for fast scanning",
      "Consistent CTA treatment across every placement",
    ],
    designs: [
      { src: "/portfolio/glow-02.webp", alt: "Glow Workshop promo variant — session details and inclusions over neon artwork", layout: "wide" },
    ],
  },
];
