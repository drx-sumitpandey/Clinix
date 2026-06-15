import { useState, useCallback } from "react";
import { HealthAssessmentForm } from "@/components/HealthAssessmentForm";
import { InfectionDetectorForm } from "@/components/InfectionDetectorForm";
import { MandalaLoader } from "@/components/MandalaLoader";
import { AssessmentResult } from "@/components/AssessmentResult";
import { InfectionResult } from "@/components/InfectionResult";
import { analyzeHealth, type HealthInput, type HealthResult } from "@/lib/healthAnalysis";
import { analyzeInfection, type InfectionInput, type InfectionResult as InfectionResultType } from "@/lib/infectionAnalysis";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Phase = "form" | "loading" | "result";

const Index = () => {
  const [healthPhase, setHealthPhase] = useState<Phase>("form");
  const [infectionPhase, setInfectionPhase] = useState<Phase>("form");
  const [healthResult, setHealthResult] = useState<HealthResult | null>(null);
  const [infectionResult, setInfectionResult] = useState<InfectionResultType | null>(null);

  const handleHealthSubmit = useCallback((input: HealthInput) => {
    setHealthPhase("loading");
    setTimeout(() => {
      const result = analyzeHealth(input);
      setHealthResult(result);
      setHealthPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  }, []);

  const handleInfectionSubmit = useCallback((input: InfectionInput) => {
    setInfectionPhase("loading");
    setTimeout(() => {
      const result = analyzeInfection(input);
      setInfectionResult(result);
      setInfectionPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 2500);
  }, []);

  const handleHealthReset = useCallback(() => {
    setHealthResult(null);
    setHealthPhase("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleInfectionReset = useCallback(() => {
    setInfectionResult(null);
    setInfectionPhase("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
            स्वास्थ्य दर्पण
          </h1>
          <p className="text-base text-foreground font-display mt-1">Swastha Darpan</p>
          <p className="text-sm text-muted-foreground font-body mt-2 max-w-md mx-auto">
            A safe, guided health assessment — not a diagnosis. Understand your symptoms and know your next steps.
          </p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="health" className="font-display text-sm">
              🩺 Health Assessment
            </TabsTrigger>
            <TabsTrigger value="infection" className="font-display text-sm">
              🔬 Bacterial vs Viral
            </TabsTrigger>
          </TabsList>

          {/* Health Assessment Tab */}
          <TabsContent value="health">
            <main>
              {healthPhase === "form" && (
                <div className="rounded-xl border border-border bg-card p-5 sm:p-7 shadow-sm">
                  <HealthAssessmentForm onSubmit={handleHealthSubmit} />
                </div>
              )}
              {healthPhase === "loading" && <MandalaLoader />}
              {healthPhase === "result" && healthResult && (
                <AssessmentResult result={healthResult} onReset={handleHealthReset} />
              )}
            </main>
          </TabsContent>

          {/* Infection Detector Tab */}
          <TabsContent value="infection">
            <main>
              {infectionPhase === "form" && (
                <div className="rounded-xl border border-border bg-card p-5 sm:p-7 shadow-sm">
                  <InfectionDetectorForm onSubmit={handleInfectionSubmit} />
                </div>
              )}
              {infectionPhase === "loading" && <MandalaLoader />}
              {infectionPhase === "result" && infectionResult && (
                <InfectionResult result={infectionResult} onReset={handleInfectionReset} />
              )}
            </main>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center border-t border-border pt-6 pb-4">
          <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-md mx-auto">
            Swastha Darpan provides general health information only. It is not a substitute for professional medical advice. 
            No data is stored or transmitted. Compliant with Indian Medical Council guidelines.
          </p>
          <p className="text-xs text-muted-foreground/60 font-body mt-3">
            Designed by Atreya Works
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
