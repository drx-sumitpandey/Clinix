import { useState } from "react";
import type { HealthInput } from "@/lib/healthAnalysis";

const symptomOptions = [
  { value: "fever", label: "Fever" },
  { value: "high_fever", label: "High Fever (>102°F)" },
  { value: "cough", label: "Cough" },
  { value: "headache", label: "Headache" },
  { value: "sore_throat", label: "Sore Throat" },
  { value: "body_ache", label: "Body Ache / Joint Pain" },
  { value: "joint_pain", label: "Severe Joint Pain" },
  { value: "fatigue", label: "Fatigue" },
  { value: "nausea", label: "Nausea" },
  { value: "stomach_pain", label: "Stomach Pain" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "vomiting", label: "Vomiting" },
  { value: "rash", label: "Skin Rash" },
  { value: "cold_chills", label: "Cold & Chills" },
  { value: "loss_of_appetite", label: "Loss of Appetite" },
  { value: "yellow_eyes", label: "Yellow Eyes / Skin" },
  { value: "chest_pain", label: "Chest Pain" },
  { value: "difficulty_breathing", label: "Difficulty Breathing" },
];

interface Props {
  onSubmit: (input: HealthInput) => void;
}

export function HealthAssessmentForm({ onSubmit }: Props) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const toggleSymptom = (value: string) => {
    setSymptoms(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !gender || symptoms.length === 0 || !duration || !severity) return;
    onSubmit({
      age: parseInt(age),
      gender,
      symptoms,
      duration,
      severity,
      additionalInfo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            Age
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. 35"
          />
        </div>
        <div>
          <label className="block text-sm font-display font-medium text-foreground mb-1.5">
            Gender
          </label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Symptoms */}
      <div>
        <label className="block text-sm font-display font-medium text-foreground mb-2">
          What symptoms are you experiencing?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {symptomOptions.map(opt => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-body cursor-pointer transition-colors
                ${symptoms.includes(opt.value)
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-input bg-card text-muted-foreground hover:border-primary/40"
                }`}
            >
              <input
                type="checkbox"
                checked={symptoms.includes(opt.value)}
                onChange={() => toggleSymptom(opt.value)}
                className="sr-only"
              />
              <span className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center
                ${symptoms.includes(opt.value) ? "bg-primary border-primary" : "border-input"}`}>
                {symptoms.includes(opt.value) && (
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

      {/* Duration */}
      <div>
        <label className="block text-sm font-display font-medium text-foreground mb-1.5">
          How long have you had these symptoms?
        </label>
        <select
          value={duration}
          onChange={e => setDuration(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select duration</option>
          <option value="1">Less than 1 day</option>
          <option value="2">1–2 days</option>
          <option value="3">3–5 days</option>
          <option value="7">6–7 days</option>
          <option value="14">More than 1 week</option>
        </select>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-display font-medium text-foreground mb-1.5">
          How severe are your symptoms?
        </label>
        <select
          value={severity}
          onChange={e => setSeverity(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select severity</option>
          <option value="mild">Mild — manageable discomfort</option>
          <option value="moderate">Moderate — affects daily activities</option>
          <option value="severe">Severe — unable to function normally</option>
        </select>
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-display font-medium text-foreground mb-1.5">
          Additional information <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          value={additionalInfo}
          onChange={e => setAdditionalInfo(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Recent travel, known conditions, current medications…"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={symptoms.length === 0}
        className="w-full rounded-md bg-primary py-3 text-sm font-display font-semibold text-primary-foreground hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyse Health Condition
      </button>
    </form>
  );
}
