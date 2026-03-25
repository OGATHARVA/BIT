import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { proposalTemplates, type ProposalData } from "@/types/proposal";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const TemplateSelector = ({ data, onChange }: Props) => {
  const select = (t: typeof proposalTemplates[0]) => {
    onChange({ templateId: t.id, templateName: t.name });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Choose a Template</h2>
      <p className="mb-8 text-muted-foreground">Select a proposal template that best fits your project type.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {proposalTemplates.map((t) => {
          const selected = data.templateId === t.id;
          return (
            <Card
              key={t.id}
              className={`cursor-pointer transition-all hover:shadow-card-hover ${selected ? "ring-2 ring-primary shadow-card-hover" : "shadow-card"}`}
              onClick={() => select(t)}
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-3xl">{t.icon}</span>
                  {selected && (
                    <div className="gradient-primary flex h-6 w-6 items-center justify-center rounded-full">
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{t.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{t.description}</p>
                <Badge variant="secondary" className="text-xs">{t.category}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
