import { motion } from "framer-motion";

const mandalaLabels = [
  "Symptoms", "History", "Lifestyle",
  "Risk Factors", "Analysis", "Regional Data",
  "Duration", "Severity", "Context",
];

export function MandalaLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="grid grid-cols-3 gap-2 w-48 h-48">
        {mandalaLabels.map((label, i) => (
          <motion.div
            key={label}
            className="rounded-md bg-secondary flex items-center justify-center text-center"
            initial={{ opacity: 0.15, scale: 0.85 }}
            animate={{
              opacity: [0.15, 1, 0.15],
              scale: [0.85, 1, 0.85],
              backgroundColor: [
                "hsl(var(--secondary))",
                i === 4
                  ? "hsl(var(--primary))"
                  : "hsl(var(--accent))",
                "hsl(var(--secondary))",
              ],
            }}
            transition={{
              duration: 2,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-[10px] font-display font-semibold text-foreground/70 px-1">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-sm text-muted-foreground font-body"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Analyzing your health data holistically…
      </motion.p>
    </div>
  );
}
