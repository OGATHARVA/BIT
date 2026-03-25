import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, RefreshCw, Check, Pencil } from "lucide-react";
import type { ProposalData, ProposalSections } from "@/types/proposal";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const sectionLabels: { key: keyof ProposalSections; label: string }[] = [
  { key: "introduction", label: "Introduction" },
  { key: "problemStatement", label: "Problem Statement" },
  { key: "proposedSolution", label: "Proposed Solution" },
  { key: "scopeOfWork", label: "Scope of Work" },
  { key: "deliverables", label: "Deliverables" },
  { key: "timeline", label: "Timeline" },
  { key: "pricing", label: "Pricing Summary" },
  { key: "terms", label: "Terms & Conditions" },
  { key: "conclusion", label: "Conclusion" },
];

const generateMockSections = (data: ProposalData): ProposalSections => {
  const c = data.clientName || "the client";
  const p = data.projectName || "the project";
  const co = data.preparedBy || "our team";
  return {
    introduction: `Dear ${c},\n\nThank you for the opportunity to submit this proposal for ${p}. ${co} is excited to partner with ${data.clientCompany || "your organization"} to deliver a solution that meets your objectives and exceeds expectations.`,
    problemStatement: data.problemStatement || `${c} is facing challenges that require a modern, scalable, and efficient solution. The current systems do not meet growing demands, leading to inefficiencies and missed opportunities.`,
    proposedSolution: `We propose a comprehensive solution leveraging ${data.services.join(", ") || "our expertise"} to address the identified challenges. Our approach combines industry best practices with innovative techniques to deliver measurable results.`,
    scopeOfWork: data.scopeOfWork || `The scope of work includes:\n• Discovery and requirements analysis\n• Solution design and architecture\n• Development and implementation\n• Testing and quality assurance\n• Deployment and training\n• Post-launch support`,
    deliverables: data.deliverables || `Key deliverables include:\n• Complete project documentation\n• Working solution deployed to production\n• User training materials\n• 30-day post-launch support`,
    timeline: `Estimated project timeline: ${data.estimatedTimeline || "To be determined"}\n\nPhase 1: Discovery & Planning (Week 1-2)\nPhase 2: Design & Development (Week 3-6)\nPhase 3: Testing & Deployment (Week 7-8)`,
    pricing: data.budget ? `Project Investment: ${data.budget}\n\nPayment Schedule:\n• 30% upon project kickoff\n• 40% at midpoint delivery\n• 30% upon final delivery and acceptance` : "Pricing will be provided upon further discussion of the project requirements.",
    terms: `Terms & Conditions:\n• This proposal is valid for 30 days from the date of issue\n• Changes to scope may affect timeline and pricing\n• All intellectual property created will be transferred upon final payment\n• Confidentiality of all shared information is guaranteed`,
    conclusion: `We are confident that ${co} is the right partner for ${p}. Our team brings deep expertise, proven methodologies, and a commitment to delivering excellence. We look forward to discussing this proposal further.\n\nBest regards,\n${co}`,
  };
};

const ProposalAIStep = ({ data, onChange }: Props) => {
  const [loading, setLoading] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    onChange({ sections: generateMockSections(data) });
    setLoading(false);
  };

  const handleRegenerate = async (key: keyof ProposalSections) => {
    if (!data.sections) return;
    setRegeneratingKey(key);
    await new Promise((r) => setTimeout(r, 1000));
    const fresh = generateMockSections(data);
    onChange({ sections: { ...data.sections, [key]: fresh[key] } });
    setRegeneratingKey(null);
  };

  const updateSection = (key: keyof ProposalSections, value: string) => {
    if (!data.sections) return;
    onChange({ sections: { ...data.sections, [key]: value } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">AI-Generated Sections</h2>
        <p className="text-muted-foreground">Configure tone and style, then generate all proposal sections with AI.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={data.tone} onValueChange={(v) => onChange({ tone: v as ProposalData["tone"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Proposal Style</Label>
          <Select value={data.proposalStyle} onValueChange={(v) => onChange({ proposalStyle: v as ProposalData["proposalStyle"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Short">Short</SelectItem>
              <SelectItem value="Detailed">Detailed</SelectItem>
              <SelectItem value="Executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleGenerate} disabled={loading} className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Generating all sections..." : data.sections ? "Regenerate All Sections" : "Generate Content"}
      </Button>

      {data.sections && (
        <div className="space-y-4">
          {sectionLabels.map(({ key, label }) => (
            <div key={key} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold text-foreground">{label}</h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost" size="sm" className="h-8 gap-1 text-xs"
                    onClick={() => setEditingKey(editingKey === key ? null : key)}
                  >
                    {editingKey === key ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                    {editingKey === key ? "Done" : "Edit"}
                  </Button>
                  <Button
                    variant="ghost" size="sm" className="h-8 gap-1 text-xs"
                    disabled={regeneratingKey === key}
                    onClick={() => handleRegenerate(key)}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${regeneratingKey === key ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                </div>
              </div>
              {editingKey === key ? (
                <Textarea
                  rows={6}
                  value={data.sections[key]}
                  onChange={(e) => updateSection(key, e.target.value)}
                />
              ) : (
                <p className="whitespace-pre-line text-sm text-muted-foreground">{data.sections[key]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProposalAIStep;
