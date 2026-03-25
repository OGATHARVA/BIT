import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import type { QuotationData } from "@/types/quotation";

interface Props {
  data: QuotationData;
  onChange: (updates: Partial<QuotationData>) => void;
}

const generateMockContent = (data: QuotationData) => {
  const client = data.clientName || "the client";
  const company = data.clientCompany || "your company";
  const project = data.projectName || "the project";

  const toneMap = {
    Formal: {
      intro: `Dear ${client},\n\nWe are pleased to present this quotation for ${project} on behalf of ${company}. This document outlines the scope, deliverables, and associated costs for the proposed engagement.`,
      terms: `Payment Terms:\n• 50% advance payment upon acceptance\n• 50% upon project completion\n• Payment due within 30 days of invoice\n• Late payments subject to 1.5% monthly interest\n• This quotation is valid for ${data.validityDays} days\n• All prices are inclusive of applicable taxes unless stated`,
      closingNote: `We appreciate the opportunity to submit this quotation and look forward to a successful partnership. Please do not hesitate to contact us should you require any clarification.`,
    },
    Friendly: {
      intro: `Hi ${client}! 👋\n\nThanks for considering us for ${project}! We're excited about the possibility of working with ${company} and have put together this quotation to give you a clear picture of what we can deliver.`,
      terms: `Here's how payments work:\n• Half upfront to get things rolling\n• The rest when we wrap up\n• We keep things simple — ${data.validityDays}-day payment window\n• Prices valid for ${data.validityDays} days\n• All prices are inclusive of applicable taxes`,
      closingNote: `We'd love to work together on this! Feel free to reach out with any questions — we're always happy to chat. Looking forward to hearing from you! 🚀`,
    },
    Professional: {
      intro: `Dear ${client},\n\nThank you for the opportunity to provide this quotation for ${project}. Based on our understanding of ${company}'s requirements, we have prepared a comprehensive breakdown of services and pricing below.`,
      terms: `Terms & Conditions:\n• Payment: 50% deposit required, balance on completion\n• Validity: This quotation is valid for ${data.validityDays} days\n• Scope changes may affect pricing\n• All prices are inclusive of applicable taxes unless stated`,
      closingNote: `We are confident in our ability to deliver exceptional results for this project. We welcome the opportunity to discuss this quotation further at your convenience.`,
    },
  };

  return toneMap[data.tone];
};

const AIContentStep = ({ data, onChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const content = generateMockContent(data);
    onChange({ generatedContent: content });
    setLoading(false);
  };

  const updateContent = (field: string, value: string) => {
    if (!data.generatedContent) return;
    onChange({
      generatedContent: { ...data.generatedContent, [field]: value },
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">AI Content Generation</h2>
        <p className="text-muted-foreground">Choose a tone and style, then let AI craft your quotation content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={data.tone} onValueChange={(v) => onChange({ tone: v as QuotationData["tone"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Description Style</Label>
          <Select value={data.descriptionStyle} onValueChange={(v) => onChange({ descriptionStyle: v as QuotationData["descriptionStyle"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Short">Short</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} disabled={loading} className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Generating..." : "Generate Content"}
      </Button>

      {data.generatedContent && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Introduction</Label>
            <Textarea rows={5} value={data.generatedContent.intro} onChange={(e) => updateContent("intro", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Terms & Conditions</Label>
            <Textarea rows={5} value={data.generatedContent.terms} onChange={(e) => updateContent("terms", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Closing Note</Label>
            <Textarea rows={3} value={data.generatedContent.closingNote} onChange={(e) => updateContent("closingNote", e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentStep;
