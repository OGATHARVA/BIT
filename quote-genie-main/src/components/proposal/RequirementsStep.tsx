import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProposalData } from "@/types/proposal";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const RequirementsStep = ({ data, onChange }: Props) => (
  <div className="mx-auto max-w-3xl space-y-8">
    <div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Requirements & Problem</h2>
      <p className="text-muted-foreground">Describe the client's problem, requirements, and objectives.</p>
    </div>
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Problem Statement</Label>
        <Textarea rows={4} value={data.problemStatement} onChange={(e) => onChange({ problemStatement: e.target.value })} placeholder="Describe the core problem or challenge the client is facing..." />
      </div>
      <div className="space-y-2">
        <Label>Client Requirements</Label>
        <Textarea rows={4} value={data.clientRequirements} onChange={(e) => onChange({ clientRequirements: e.target.value })} placeholder="List the key requirements and expectations..." />
      </div>
      <div className="space-y-2">
        <Label>Objectives</Label>
        <Textarea rows={3} value={data.objectives} onChange={(e) => onChange({ objectives: e.target.value })} placeholder="What are the goals to be achieved?" />
      </div>
      <div className="space-y-2">
        <Label>Additional Notes</Label>
        <Textarea rows={2} value={data.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="Any other relevant details..." />
      </div>
    </div>
  </div>
);

export default RequirementsStep;
