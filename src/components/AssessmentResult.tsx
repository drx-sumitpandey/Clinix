import { motion } from "framer-motion";
import type { HealthResult } from "@/lib/healthAnalysis";
import { ThaliCard } from "./ThaliCard";

const concernStyles: Record<HealthResult["concern"], { bg: string; label: string }> = {
  low: { bg: "bg-secondary", label: "Low Concern" },
  monitor: { bg: "bg-primary/10", label: "Monitor" },
  consult: { bg: "bg-destructive/10", label: "Consult a Professional" },
};

export function AssessmentResult({ result, onReset }: { result: HealthResult; onReset: () => void }) {
  const style = concernStyles[result.concern];

  return (
    <div className="space-y-6">
      {/* Synthesis Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl ${style.bg} p-6 text-center border border-border`}
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-display font-semibold bg-card text-foreground mb-3">
          {style.label}
        </span>
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          {result.summaryTitle}
        </h2>
        <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-lg mx-auto">
          {result.summaryDescription}
        </p>
      </motion.div>

      {/* Thali Items */}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Your Health Thali
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          Each card below addresses a different aspect of your wellbeing — like a balanced thali.
        </p>
        {result.thaliItems.map((item, i) => (
          <ThaliCard key={item.title} item={item} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-lg bg-secondary/60 p-4 text-center"
      >
        <p className="text-xs text-muted-foreground font-body">
          <strong>Medical Disclaimer:</strong> {result.disclaimer}
        </p>
      </motion.div>

      {/* Reset */}
      <div className="text-center pt-2 pb-8">
        <button
          onClick={onReset}
          className="text-sm text-secondary-foreground underline underline-offset-4 hover:text-foreground transition-colors font-body"
        >
          Start a new assessment
        </button>
      </div>
    </div>
  );
}
