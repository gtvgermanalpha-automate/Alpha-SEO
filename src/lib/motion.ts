import type { Variants } from "framer-motion";

/** Standard easing — a refined, premium ease-out */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Fade up, used for most on-scroll reveals */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

/** Container that staggers its children (e.g. service cards) */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/** Item used inside a staggerContainer */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

/** Shared viewport config so reveals trigger once, slightly before fully in view */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };
