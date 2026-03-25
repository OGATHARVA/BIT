import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => (
  <div className="flex items-center justify-center gap-1">
    {steps.map((label, i) => (
      <div key={i} className="flex items-center gap-1">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
              i < currentStep
                ? "gradient-primary text-primary-foreground"
                : i === currentStep
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span
            className={cn(
              "hidden text-sm font-medium md:block",
              i <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={cn("mx-2 h-px w-8 md:w-12", i < currentStep ? "bg-primary" : "bg-border")} />
        )}
      </div>
    ))}
  </div>
);

export default Stepper;
