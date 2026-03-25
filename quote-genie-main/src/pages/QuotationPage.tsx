import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Stepper from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import UploadStep from "@/components/quotation/UploadStep";
import DetailsStep from "@/components/quotation/DetailsStep";
import AIContentStep from "@/components/quotation/AIContentStep";
import PreviewStep from "@/components/quotation/PreviewStep";
import { defaultQuotationData, type QuotationData } from "@/types/quotation";

const STEPS = ["Upload", "Details", "AI Content", "Preview"];

const QuotationPage = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuotationData>(defaultQuotationData);

  const update = (updates: Partial<QuotationData>) => setData((prev) => ({ ...prev, ...updates }));

  const renderStep = () => {
    switch (step) {
      case 0: return <UploadStep data={data} onChange={update} />;
      case 1: return <DetailsStep data={data} onChange={update} />;
      case 2: return <AIContentStep data={data} onChange={update} />;
      case 3: return <PreviewStep data={data} />;
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

          {/* Navigation */}
          <div className="container flex justify-between">
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 && (
              <Button onClick={() => setStep((s) => s + 1)} className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2">
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

export default QuotationPage;
