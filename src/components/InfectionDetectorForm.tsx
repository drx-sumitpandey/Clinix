import { useState } from "react";
import type { InfectionInput } from "@/lib/infectionAnalysis";

const clinicalSymptoms = [
  { key: "localized" as const, label: "Localized Pain/Swelling" },
  { key: "discharge" as const, label: "Yellow/Green Discharge" },
  { key: "persistent" as const, label: "Persistent High Fever" },
  { key: "runny" as const, label: "Runny Nose/Congestion" },
  { key: "aches" as const, label: "Body Aches/Fatigue" },
  { key: "rapid" as const, label: "Rapid Symptom Worsening" },
];

interface Props {
  onSubmit: (input: InfectionInput) => void;
}

export function InfectionDetectorForm({ onSubmit }: Props) {
  const [crp, setCrp] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [wbc, setWbc] = useState("");
  const [temperature, setTemperature] = useState("");
  const [symptoms, setSymptoms] = useState({
    localized: false,
    discharge: false,
    persistent: false,
    runny: false,
    aches: false,
    rapid: false,
  });

  const toggleSymptom = (key: keyof typeof symptoms) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crp || !symptomDuration) return;
    onSubmit({
      crp: parseFloat(crp),
      symptomDuration: parseFloat(symptomDuration),
      wbc: wbc ? parseFloat(wbc) : null,
      temperature: temperature ? parseFloat(temperature) : null,
      symptoms,
    });
  };

  const inputClass =
    "w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CRP & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            CRP Level (mg/L) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={crp}
            onChange={e => setCrp(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. 25.5"
          />
        </div>
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            Symptom Onset (hours) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={symptomDuration}
            onChange={e => setSymptomDuration(e.target.value)}
            required
            className={inputClass}
            placeholder="e.g. 48"
          />
        </div>
      </div>

      {/* WBC & Temperature */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            WBC Count (×10³/μL) <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={wbc}
            onChange={e => setWbc(e.target.value)}
            className={inputClass}
            placeholder="e.g. 12.5"
          />
        </div>
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            Temperature (°F) <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <input
            type="number"
            step="0.1"
            min="95"
            max="110"
            value={temperature}
            onChange={e => setTemperature(e.target.value)}
            className={inputClass}
            placeholder="e.g. 102.5"
          />
        </div>
      </div>

      {/* Clinical Symptoms */}
      <div>
        <label className="block text-sm font-display font-medium text-foreground mb-2">
          Clinical Symptoms
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {clinicalSymptoms.map(opt => (
            <label
              key={opt.key}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-body cursor-pointer transition-colors
                ${symptoms[opt.key]
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-primary/40"
                }`}
            >
              <input
                type="checkbox"
                checked={symptoms[opt.key]}
                onChange={() => toggleSymptom(opt.key)}
                className="sr-only"
              />
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center
                  ${symptoms[opt.key] ? "bg-primary border-primary" : "border-input"}`}
              >
                {symptoms[opt.key] && (
                  <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-md border-l-4 border-l-primary bg-primary/5 p-4">
        <p className="text-xs text-muted-foreground font-body">
          <strong className="text-foreground">⚕️ Note:</strong> This tool uses evidence-based markers including CRP levels and estimated CRP velocity (eCRPv). CRP and WBC values are typically available from a basic blood test.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!crp || !symptomDuration}
        className="w-full rounded-md bg-primary py-3 text-sm font-display font-semibold text-primary-foreground hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyse Infection Type
      </button>
    </form>
  );
}
