export interface HealthInput {
  age: number;
  gender: string;
  symptoms: string[];
  duration: string;
  severity: string;
  additionalInfo: string;
}

export interface ThaliItem {
  title: string;
  description: string;
  type: "monitor" | "consult" | "lifestyle" | "selfcare" | "emergency";
  icon: string;
}

export interface HealthResult {
  concern: "low" | "monitor" | "consult";
  summaryTitle: string;
  summaryDescription: string;
  thaliItems: ThaliItem[];
  disclaimer: string;
}

const symptomData: Record<string, { severity: number; conditions: string[]; emergency: boolean }> = {
  fever: { severity: 2, conditions: ["viral_infection", "flu", "dengue", "malaria", "typhoid"], emergency: false },
  cough: { severity: 1, conditions: ["common_cold", "flu", "tuberculosis", "bronchitis"], emergency: false },
  headache: { severity: 1, conditions: ["tension", "migraine", "flu", "dengue", "dehydration"], emergency: false },
  sore_throat: { severity: 1, conditions: ["common_cold", "flu", "tonsillitis"], emergency: false },
  body_ache: { severity: 2, conditions: ["flu", "dengue", "chikungunya", "viral_infection"], emergency: false },
  fatigue: { severity: 1, conditions: ["anemia", "flu", "typhoid", "stress"], emergency: false },
  nausea: { severity: 2, conditions: ["gastroenteritis", "food_poisoning", "hepatitis"], emergency: false },
  stomach_pain: { severity: 2, conditions: ["gastroenteritis", "food_poisoning", "appendicitis"], emergency: false },
  diarrhea: { severity: 2, conditions: ["cholera", "gastroenteritis", "food_poisoning", "typhoid"], emergency: false },
  vomiting: { severity: 3, conditions: ["gastroenteritis", "food_poisoning", "hepatitis"], emergency: false },
  chest_pain: { severity: 5, conditions: ["cardiac"], emergency: true },
  difficulty_breathing: { severity: 5, conditions: ["asthma", "pneumonia", "cardiac"], emergency: true },
  rash: { severity: 2, conditions: ["dengue", "chikungunya", "allergic_reaction", "measles"], emergency: false },
  joint_pain: { severity: 2, conditions: ["chikungunya", "dengue", "arthritis"], emergency: false },
  loss_of_appetite: { severity: 1, conditions: ["typhoid", "hepatitis", "flu"], emergency: false },
  yellow_eyes: { severity: 3, conditions: ["hepatitis", "jaundice", "malaria"], emergency: false },
  high_fever: { severity: 3, conditions: ["dengue", "malaria", "typhoid", "chikungunya"], emergency: false },
  cold_chills: { severity: 2, conditions: ["malaria", "flu", "typhoid"], emergency: false },
};

const indianEpidemicContext: Record<string, string> = {
  dengue: "Dengue is prevalent during and after monsoon season in India. Watch for high fever with severe body/joint pain and rash.",
  malaria: "Malaria remains endemic in many Indian states. Cyclic fever with chills is a hallmark sign.",
  typhoid: "Typhoid is common due to contaminated water. Persistent fever that gradually increases over days is characteristic.",
  chikungunya: "Chikungunya causes severe joint pain that can persist for weeks. Common in tropical and subtropical regions of India.",
  cholera: "Cholera outbreaks occur in areas with poor sanitation. Profuse watery diarrhea requires immediate medical attention.",
  tuberculosis: "India carries a significant tuberculosis burden. Persistent cough lasting more than 2 weeks warrants screening.",
  hepatitis: "Hepatitis A and E spread through contaminated water and food. Jaundice (yellowing of skin/eyes) is a key sign.",
};

export function analyzeHealth(input: HealthInput): HealthResult {
  const { symptoms, duration, severity, age } = input;

  // Check for emergencies
  const hasEmergency = symptoms.some(s => symptomData[s]?.emergency);
  if (hasEmergency) {
    return {
      concern: "consult",
      summaryTitle: "Seek Immediate Medical Attention",
      summaryDescription: "Your symptoms include signs that require urgent professional evaluation. Please visit the nearest hospital or call emergency services without delay.",
      thaliItems: [
        { title: "Emergency Care", description: "Visit the nearest hospital emergency department immediately.", type: "emergency", icon: "🏥" },
        { title: "Do Not Delay", description: "Chest pain and breathing difficulty can indicate serious conditions requiring immediate treatment.", type: "emergency", icon: "⚡" },
        { title: "Emergency Helpline", description: "Dial 108 (National Ambulance) or 112 (Emergency) for immediate assistance.", type: "emergency", icon: "📞" },
      ],
      disclaimer: "This is not a diagnosis. These symptoms require immediate professional medical evaluation.",
    };
  }

  // Calculate severity score
  let totalSeverity = 0;
  const detectedConditions: Set<string> = new Set();

  for (const symptom of symptoms) {
    const data = symptomData[symptom];
    if (data) {
      totalSeverity += data.severity;
      data.conditions.forEach(c => detectedConditions.add(c));
    }
  }

  // Duration multiplier
  const durationMultiplier = duration === "14" ? 1.5 : duration === "7" ? 1.3 : duration === "3" ? 1.1 : 1;
  const severityMultiplier = severity === "severe" ? 1.5 : severity === "moderate" ? 1.2 : 1;
  const ageMultiplier = age < 5 || age > 65 ? 1.3 : 1;

  const finalScore = totalSeverity * durationMultiplier * severityMultiplier * ageMultiplier;

  // Determine concern level (NO percentage scores — qualitative only)
  let concern: "low" | "monitor" | "consult";
  let summaryTitle: string;
  let summaryDescription: string;

  if (finalScore >= 12) {
    concern = "consult";
    summaryTitle = "Professional Consultation Recommended";
    summaryDescription = "Based on the combination and duration of your symptoms, it would be wise to consult a healthcare professional for a proper evaluation. This is not a diagnosis — it's a recommendation for your safety.";
  } else if (finalScore >= 6) {
    concern = "monitor";
    summaryTitle = "Monitor Your Symptoms Carefully";
    summaryDescription = "Your symptoms suggest a condition that may resolve on its own, but should be watched closely. If symptoms worsen or persist beyond a few days, please consult a doctor.";
  } else {
    concern = "low";
    summaryTitle = "Low Concern — Self-Care May Suffice";
    summaryDescription = "Your symptoms appear mild and may be manageable with rest and basic care. However, trust your body — if something feels wrong, seeking medical advice is always appropriate.";
  }

  // Build thali items
  const thaliItems: ThaliItem[] = [];

  // Indian epidemic context
  const epidemicConditions = [...detectedConditions].filter(c => indianEpidemicContext[c]);
  if (epidemicConditions.length > 0) {
    const context = epidemicConditions.map(c => indianEpidemicContext[c]).join(" ");
    thaliItems.push({
      title: "Regional Health Context",
      description: context,
      type: "monitor",
      icon: "🗺️",
    });
  }

  // Self-care recommendations
  if (symptoms.includes("fever") || symptoms.includes("high_fever")) {
    thaliItems.push({
      title: "Fever Management",
      description: "Stay well-hydrated with ORS (oral rehydration solution), coconut water, or buttermilk. Paracetamol (as per package directions) can help manage fever. Avoid self-medicating with antibiotics.",
      type: "selfcare",
      icon: "🌡️",
    });
  }

  if (symptoms.includes("diarrhea") || symptoms.includes("vomiting")) {
    thaliItems.push({
      title: "Hydration is Critical",
      description: "Take frequent small sips of ORS. Avoid heavy, oily, or spicy foods. BRAT diet (bananas, rice, applesauce, toast) can help settle the stomach. Seek medical care if you cannot keep fluids down.",
      type: "selfcare",
      icon: "💧",
    });
  }

  if (symptoms.includes("cough") || symptoms.includes("sore_throat")) {
    thaliItems.push({
      title: "Respiratory Comfort",
      description: "Warm water with honey and turmeric can soothe the throat. Steam inhalation may ease congestion. If cough persists beyond 2 weeks, consult a doctor to rule out tuberculosis.",
      type: "selfcare",
      icon: "🫁",
    });
  }

  // Lifestyle factors
  thaliItems.push({
    title: "Nutrition & Rest",
    description: "Eat light, nourishing meals — khichdi, dal, and seasonal fruits. Prioritise sleep and avoid strenuous activity until you feel better.",
    type: "lifestyle",
    icon: "🍲",
  });

  if (concern === "consult" || concern === "monitor") {
    thaliItems.push({
      title: "Questions for Your Doctor",
      description: `When you visit a doctor, mention: your symptoms (${symptoms.join(", ")}), how long you've had them, and any recent travel or contact with sick individuals. Ask about any tests they recommend.`,
      type: "consult",
      icon: "📋",
    });
  }

  // When to seek emergency care
  thaliItems.push({
    title: "When to Seek Emergency Care",
    description: "Go to a hospital immediately if you experience: difficulty breathing, persistent chest pain, inability to keep fluids down for 24+ hours, confusion or altered consciousness, or a very high fever (above 104°F / 40°C) that doesn't respond to Paracetamol.",
    type: "emergency",
    icon: "🚨",
  });

  return {
    concern,
    summaryTitle,
    summaryDescription,
    thaliItems,
    disclaimer: "This tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. It does not prescribe medications. Always consult a qualified healthcare provider. Compliant with Indian Medical Council guidelines — no diagnosis or prescription is made.",
  };
}
