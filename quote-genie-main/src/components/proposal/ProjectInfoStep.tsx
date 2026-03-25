import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProposalData } from "@/types/proposal";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const ProjectInfoStep = ({ data, onChange }: Props) => (
  <div className="mx-auto max-w-3xl space-y-8">
    <div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Project Information</h2>
      <p className="text-muted-foreground">Enter the client and project details for this proposal.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Client Name</Label>
        <Input value={data.clientName} onChange={(e) => onChange({ clientName: e.target.value })} placeholder="John Doe" />
      </div>
      <div className="space-y-2">
        <Label>Client Company</Label>
        <Input value={data.clientCompany} onChange={(e) => onChange({ clientCompany: e.target.value })} placeholder="Acme Corp" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Proposal Title</Label>
        <Input value={data.proposalTitle} onChange={(e) => onChange({ proposalTitle: e.target.value })} placeholder="Website Redesign Proposal" />
      </div>
      <div className="space-y-2">
        <Label>Project Name</Label>
        <Input value={data.projectName} onChange={(e) => onChange({ projectName: e.target.value })} placeholder="Corporate Website v2" />
      </div>
      <div className="space-y-2">
        <Label>Prepared By</Label>
        <Input value={data.preparedBy} onChange={(e) => onChange({ preparedBy: e.target.value })} placeholder="Your Name / Company" />
      </div>
      <div className="space-y-2">
        <Label>Proposal Date</Label>
        <Input type="date" value={data.proposalDate} onChange={(e) => onChange({ proposalDate: e.target.value })} />
      </div>
    </div>
  </div>
);

export default ProjectInfoStep;
