import { motion } from "framer-motion";
import type { InfectionResult as InfectionResultType } from "@/lib/infectionAnalysis";

const typeStyles: Record<InfectionResultType["type"], { bg: string; border: string }> = {
  bacterial: { bg: "bg-primary/10", border: "border-primary" },
  viral: { bg: "bg-terracotta/10", border: "border-terracotta" },
  uncertain: { bg: "bg-secondary/10", border: "border-border" },
};

const confidenceLabel: Record<string, string> = {
  high: "High Confidence",
  moderate: "Moderate Confidence",
  low: "Low Confidence — Additional Testing Recommended",
};

export function InfectionResult({
  result,
  onReset,
}: {
  result: InfectionResultType;
  onReset: () => void;
}) {
  const style = typeStyles[result.type];

  return (
    <div className="space-y-5">
      {/* Diagnosis header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl ${style.bg} border-2 ${style.border} p-6 text-center`}
      >
        <span className="text-3xl">{result.icon}</span>
        <h2 className="font-display text-xl font-semibold text-foreground mt-2 mb-1">
          {result.diagnosis}
        </h2>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-display font-semibold bg-card text-foreground">
          {confidenceLabel[result.confidence]}
        </span>
      </motion.div>

      {/* Probabilities */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="rounded-lg bg-card border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground font-body mb-1">Bacterial</p>
          <p className="font-display text-lg font-semibold text-foreground">{result.bacterialProbability}%</p>
        </div>
        <div className="rounded-lg bg-card border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground font-body mb-1">Viral</p>
          <p className="font-display text-lg font-semibold text-foreground">{result.viralProbability}%</p>
        </div>
        <div className="rounded-lg bg-card border border-border p-4 text-center">
          <p className="text-xs text-muted-foreground font-body mb-1">eCRPv</p>
          <p className="font-display text-lg font-semibold text-foreground">{result.eCRPv}</p>
          <p className="text-[10px] text-muted-foreground">mg/L/h</p>
        </div>
      </motion.div>

      {/* Clinical indicators */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-lg bg-card border border-border p-5"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Clinical Indicators</h3>
        <ul className="space-y-2">
          {result.details.map((detail, i) => (
            <li key={i} className="text-sm text-muted-foreground font-body flex gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="rounded-lg bg-secondary/10 border border-border p-5"
      >
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Clinical Recommendations</h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="text-sm text-muted-foreground font-body flex gap-2">
              <span className="text-terracotta mt-0.5 flex-shrink-0">→</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-lg bg-secondary/60 p-4 text-center"
      >
        <p className="text-xs text-muted-foreground font-body">
          <strong>⚕️ Clinical Note:</strong> This tool is a clinical decision support aid based on current research (2024–2025). Always consult healthcare professionals for definitive diagnosis and treatment decisions.
        </p>
      </motion.div>

      {/* Reset */}
      <div className="text-center pt-2 pb-8">
        <button
          onClick={onReset}
          className="text-sm text-secondary-foreground underline underline-offset-4 hover:text-foreground transition-colors font-body"
        >
          Run another analysis
        </button>
      </div>
    </div>
  );
}
