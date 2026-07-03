/**
 * Portfolio projects shown on /portfolio. Social-media + brand design work,
 * sourced from the supplied portfolio deck (project details only — no personal
 * attribution). Plain data module (not CMS-managed yet).
 */
export type PortfolioMetric = { value: string; label: string };

export type PortfolioProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  metrics: PortfolioMetric[];
  highlights: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "evolution-magazine",
    title: "Evolution Magazine",
    category: "Social Media Design & Content",
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
  },
  {
    slug: "elevon-pakistan",
    title: "Elevon Pakistan",
    category: "Social Media Design",
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
  },
  {
    slug: "pstve-glo",
    title: "Pstve Glo",
    category: "Brand Design",
    summary:
      "A full brand identity and aesthetic Instagram grid for a candle brand — highlights, layout and visuals all aligned to a calm 'a need to reset' feeling, and tuned for strong engagement.",
    metrics: [
      { value: "Full", label: "Brand identity + grid" },
      { value: "High", label: "Performing analytics" },
    ],
    highlights: [
      "Highlight covers designed and aligned to the brand's identity",
      "A fully set, cohesive Instagram grid for the brand",
      "Calm, considered visuals that carry the 'need to reset' message",
    ],
  },
];
