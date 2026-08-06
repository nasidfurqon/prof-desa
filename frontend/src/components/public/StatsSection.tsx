import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { fadeUp, viewportOnce } from "../../lib/motion";

interface StatItemProps {
  label: string;
  value: number;
  delay: number;
}

function StatItem({ label, value, delay }: StatItemProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, delay]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      custom={delay}
      className="rounded-2xl bg-white p-6 text-center shadow-sm"
    >
      <p ref={ref} className="text-3xl font-bold text-secondary">
        {display.toLocaleString("id-ID")}
      </p>
      <p className="mt-1 text-sm text-secondary-dark/60">{label}</p>
    </motion.div>
  );
}

export interface StatsSectionProps {
  stats: { label: string; value: number }[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} label={stat.label} value={stat.value} delay={i * 0.1} />
      ))}
    </div>
  );
}
