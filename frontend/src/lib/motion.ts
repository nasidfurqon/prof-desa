import type { Variants } from "framer-motion";

export const viewportOnce = { once: true, amount: 0.2 };

function withDelay(delay: number) {
  return { duration: 0.4, ease: "easeOut" as const, delay };
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({ opacity: 1, transition: withDelay(delay) }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({ opacity: 1, y: 0, transition: withDelay(delay) }),
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (delay: number = 0) => ({ opacity: 1, x: 0, transition: withDelay(delay) }),
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (delay: number = 0) => ({ opacity: 1, x: 0, transition: withDelay(delay) }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({ opacity: 1, scale: 1, transition: withDelay(delay) }),
};

export const revealVariants = {
  fadeIn,
  fadeUp,
  fadeLeft,
  fadeRight,
  scaleIn,
};

export type RevealVariant = keyof typeof revealVariants;
