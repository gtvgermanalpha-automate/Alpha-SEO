"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { easeOut } from "@/lib/motion";
import { useTapActivate } from "@/components/ui/useTapActivate";

/* Resting + active visuals driven by Framer Motion (transform / shadow / border).
   Hex values mirror the @theme tokens in globals.css (Profitwise rebrand). */
const LINE = "#e5e7eb"; // --color-line (border gray)
const ACTIVE_BORDER = "rgba(238, 89, 53, 0.4)"; // accent orange @ 40%
const GLOW = "0 24px 50px -26px rgba(238, 89, 53, 0.3)"; // soft orange lift
const NO_GLOW = "0 24px 50px -26px rgba(238, 89, 53, 0)";

type InteractiveCardProps = {
  /** Render-prop so children can mirror the hover/tap state with their own styles. */
  children: (active: boolean) => ReactNode;
  className?: string;
  /** Lift distance in px (default -8). */
  lift?: number;
};

/**
 * A card that plays its hover animation on desktop hover AND on mobile tap.
 *
 * Framer Motion's `animate` + `whileTap` drive the motion (reliable on iOS
 * Safari, unlike the `whileInView` viewport detection used before). The trigger
 * (hover vs tap, single-active coordination) comes from {@link useTapActivate}.
 */
export function InteractiveCard({ children, className, lift = -8 }: InteractiveCardProps) {
  const reduce = useReducedMotion();
  const { active, bind } = useTapActivate();

  return (
    <motion.article
      {...bind}
      className={className}
      initial={false}
      animate={
        reduce
          ? { borderColor: active ? ACTIVE_BORDER : LINE }
          : {
              y: active ? lift : 0,
              boxShadow: active ? GLOW : NO_GLOW,
              borderColor: active ? ACTIVE_BORDER : LINE,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {children(active)}
    </motion.article>
  );
}
