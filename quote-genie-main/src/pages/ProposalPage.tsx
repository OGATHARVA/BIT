import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import TemplateSelector from "@/components/proposal/TemplateSelector";
import ProjectInfoStep from "@/components/proposal/ProjectInfoStep";
import RequirementsStep from "@/components/proposal/RequirementsStep";
import ServicesStep from "@/components/proposal/ServicesStep";
import ProposalAIStep from "@/components/proposal/ProposalAIStep";
import ProposalPreviewStep from "@/components/proposal/ProposalPreviewStep";
import { defaultProposalData, type ProposalData } from "@/types/proposal";

const STEPS = ["Template", "Project Info", "Requirements", "Services", "AI Sections", "Preview"];

const ProposalPage = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProposalData>(defaultProposalData);

  const update = (updates: Partial<ProposalData>) => setData((prev) => ({ ...prev, ...updates }));

  const canAdvance = () => {
    if (step === 0 && !data.templateId) return false;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <TemplateSelector data={data} onChange={update} />;
      case 1: return <ProjectInfoStep data={data} onChange={update} />;
      case 2: return <RequirementsStep data={data} onChange={update} />;
      case 3: return <ServicesStep data={data} onChange={update} />;
      case 4: return <ProposalAIStep data={data} onChange={update} />;
      case 5: return <ProposalPreviewStep data={data} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="container">
          <div className="mb-10">
            <Stepper steps={STEPS} currentStep={step} />
          </div>
          <div className="mb-10">{renderStep()}</div>
          <div className="container flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 && (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProposalPage;
