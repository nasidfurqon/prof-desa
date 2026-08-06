import { motion } from "framer-motion";
import { ReactNode } from "react";
import { RevealVariant, revealVariants, viewportOnce } from "../../lib/motion";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}

export function Reveal({ children, variant = "fadeUp", delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={revealVariants[variant]}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}
