export interface InfectionInput {
  crp: number;
  symptomDuration: number;
  wbc: number | null;
  temperature: number | null;
  symptoms: {
    localized: boolean;
    discharge: boolean;
    persistent: boolean;
    runny: boolean;
    aches: boolean;
    rapid: boolean;
  };
}

export interface InfectionResult {
  diagnosis: string;
  type: "bacterial" | "viral" | "uncertain";
  icon: string;
  confidence: "high" | "moderate" | "low";
  bacterialProbability: string;
  viralProbability: string;
  eCRPv: string;
  details: string[];
  recommendations: string[];
}

export function analyzeInfection(input: InfectionInput): InfectionResult {
  const { crp, symptomDuration, wbc, temperature, symptoms } = input;

  let bacterialScore = 0;
  let viralScore = 0;
  let confidence: "high" | "moderate" | "low" = "moderate";
  const details: string[] = [];

  // eCRPv — estimated CRP velocity
  const eCRPv = crp / symptomDuration;

  if (eCRPv >= 4) {
    bacterialScore += 40;
    details.push(`Very high eCRPv (${eCRPv.toFixed(2)} mg/L/h) strongly indicates bacterial infection`);
    confidence = "high";
  } else if (eCRPv >= 1.5) {
    bacterialScore += 25;
    details.push(`Elevated eCRPv (${eCRPv.toFixed(2)} mg/L/h) suggests bacterial infection`);
  } else if (eCRPv < 0.5) {
    viralScore += 25;
    details.push(`Low eCRPv (${eCRPv.toFixed(2)} mg/L/h) suggests viral infection`);
  } else {
    details.push(`Moderate eCRPv (${eCRPv.toFixed(2)} mg/L/h) — further evaluation needed`);
  }

  // CRP absolute level
  if (crp >= 100) {
    bacterialScore += 20;
    details.push(`High CRP level (${crp} mg/L) commonly seen in bacterial infections`);
  } else if (crp < 40) {
    viralScore += 15;
    details.push(`Lower CRP level (${crp} mg/L) more typical of viral infections`);
  }

  // WBC
  if (wbc !== null) {
    if (wbc > 15) {
      bacterialScore += 15;
      details.push(`Elevated WBC count (${wbc} ×10³/μL) suggests bacterial infection`);
    } else if (wbc < 4) {
      viralScore += 10;
      details.push(`Low WBC count (${wbc} ×10³/μL) may indicate viral infection`);
    }
  }

  // Temperature
  if (temperature !== null && temperature > 103) {
    bacterialScore += 10;
    details.push(`Very high fever (${temperature}°F) more common in bacterial infections`);
  }

  // Clinical symptoms
  if (symptoms.localized) {
    bacterialScore += 15;
    details.push("Localized pain/swelling suggests bacterial infection");
  }
  if (symptoms.discharge) {
    bacterialScore += 15;
    details.push("Yellow/green discharge indicates bacterial infection");
  }
  if (symptoms.persistent) {
    bacterialScore += 10;
    details.push("Persistent high fever supports bacterial diagnosis");
  }
  if (symptoms.runny) {
    viralScore += 12;
    details.push("Runny nose/congestion typical of viral infections");
  }
  if (symptoms.aches) {
    viralScore += 12;
    details.push("Generalized body aches common in viral infections");
  }
  if (symptoms.rapid && crp > 100) {
    bacterialScore += 10;
    details.push("Rapid worsening with high CRP suggests bacterial progression");
  }

  // Calculate probability
  const totalScore = bacterialScore + viralScore;
  const bacterialProbability = totalScore > 0 ? (bacterialScore / totalScore) * 100 : 50;

  let diagnosis: string;
  let type: "bacterial" | "viral" | "uncertain";
  let icon: string;
  let recommendations: string[];

  if (bacterialProbability >= 65) {
    diagnosis = "Bacterial Infection Likely";
    type = "bacterial";
    icon = "🦠";
    confidence = bacterialProbability >= 80 ? "high" : "moderate";
    recommendations = [
      "Consider antibiotic therapy after culture confirmation",
      "Monitor closely for signs of sepsis or complications",
      "Consider blood cultures and specific site cultures",
      "Reassess after 48–72 hours if symptoms persist",
      "Complete the full antibiotic course if prescribed",
    ];
  } else if (bacterialProbability <= 35) {
    diagnosis = "Viral Infection Likely";
    type = "viral";
    icon = "🧬";
    confidence = bacterialProbability <= 20 ? "high" : "moderate";
    recommendations = [
      "Supportive care: rest, hydration, and symptom management",
      "Avoid unnecessary antibiotic prescription",
      "Monitor for secondary bacterial infection (worsening after initial improvement)",
      "Antipyretics and analgesics as needed for comfort",
      "Expected course is 7–14 days — watch for warning signs",
    ];
  } else {
    diagnosis = "Uncertain — Further Testing Required";
    type = "uncertain";
    icon = "⚠️";
    confidence = "low";
    recommendations = [
      "Consider additional diagnostic tests (PCT, blood culture, specific pathogen testing)",
      "Clinical observation for 24–48 hours may clarify diagnosis",
      "Consider FebriDx or MeMed BV rapid diagnostic test if available",
      "Watch for evolving symptoms indicating bacterial superinfection",
      "Avoid empiric antibiotics unless patient is high-risk or deteriorating",
    ];
  }

  return {
    diagnosis,
    type,
    icon,
    confidence,
    bacterialProbability: bacterialProbability.toFixed(1),
    viralProbability: (100 - bacterialProbability).toFixed(1),
    eCRPv: eCRPv.toFixed(2),
    details,
    recommendations,
  };
}
