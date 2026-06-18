import {
  BookOpen,
  Receipt,
  Percent,
  Users,
  Building2,
  TrendingUp,
  BadgePoundSterling,
  UserRound,
  Cloud,
  Lightbulb,
  MessagesSquare,
  ShieldCheck,
  Laptop,
  ShoppingCart,
  Rocket,
  Home,
  UtensilsCrossed,
  Stethoscope,
  HardHat,
  Palette,
  PhoneCall,
  Settings2,
  LineChart,
  Sparkles,
  Award,
  Zap,
  MapPin,
  type LucideProps,
} from "lucide-react";

/** Explicit map keeps the bundle tree-shaken (no full-library import). */
const map = {
  BookOpen,
  Receipt,
  Percent,
  Users,
  Building2,
  TrendingUp,
  BadgePoundSterling,
  UserRound,
  Cloud,
  Lightbulb,
  MessagesSquare,
  ShieldCheck,
  Laptop,
  ShoppingCart,
  Rocket,
  Home,
  UtensilsCrossed,
  Stethoscope,
  HardHat,
  Palette,
  PhoneCall,
  Settings2,
  LineChart,
  Sparkles,
  Award,
  Zap,
  MapPin,
} as const;

export type IconName = keyof typeof map;

/** Runtime list of allowed icon names — for CMS pickers and validation. */
export const iconNames = Object.keys(map) as IconName[];

/** Whether a string is a known (renderable) icon name. */
export function isIconName(value: unknown): value is IconName {
  return typeof value === "string" && value in map;
}

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp {...props} />;
}
