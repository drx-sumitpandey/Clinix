import { motion } from "framer-motion";
import type { ThaliItem } from "@/lib/healthAnalysis";

const typeStyles: Record<ThaliItem["type"], string> = {
  monitor: "border-l-4 border-l-accent",
  consult: "border-l-4 border-l-primary",
  lifestyle: "border-l-4 border-l-terracotta",
  selfcare: "border-l-4 border-l-terracotta/60",
  emergency: "border-l-4 border-l-destructive",
};

export function ThaliCard({ item, index }: { item: ThaliItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className={`rounded-lg bg-card p-5 shadow-sm ${typeStyles[item.type]}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
        <div>
          <h4 className="font-display font-semibold text-base text-foreground mb-1">
            {item.title}
          </h4>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
