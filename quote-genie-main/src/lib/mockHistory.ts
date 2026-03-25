export interface DocumentItem {
  id: string;
  title: string;
  clientName: string;
  type: "quotation" | "proposal";
  createdAt: string;
  status: "draft" | "generated" | "completed";
  version: number;
}

export const mockDocuments: DocumentItem[] = [
  {
    id: "q1",
    title: "Website Redesign Quotation",
    clientName: "Acme Corp",
    type: "quotation",
    createdAt: "2026-03-22T10:30:00Z",
    status: "completed",
    version: 2,
  },
  {
    id: "p1",
    title: "Mobile App Development Proposal",
    clientName: "TechStart Pvt Ltd",
    type: "proposal",
    createdAt: "2026-03-21T14:00:00Z",
    status: "completed",
    version: 1,
  },
  {
    id: "q2",
    title: "SEO Services Quotation",
    clientName: "GreenLeaf Industries",
    type: "quotation",
    createdAt: "2026-03-20T09:15:00Z",
    status: "generated",
    version: 1,
  },
  {
    id: "p2",
    title: "Cloud Migration Proposal",
    clientName: "FinServe Bank",
    type: "proposal",
    createdAt: "2026-03-19T16:45:00Z",
    status: "draft",
    version: 1,
  },
  {
    id: "q3",
    title: "Annual Maintenance Contract",
    clientName: "Metro Logistics",
    type: "quotation",
    createdAt: "2026-03-18T11:00:00Z",
    status: "completed",
    version: 3,
  },
  {
    id: "p3",
    title: "AI Chatbot Integration Proposal",
    clientName: "RetailMax",
    type: "proposal",
    createdAt: "2026-03-17T08:30:00Z",
    status: "generated",
    version: 1,
  },
  {
    id: "q4",
    title: "Office Interior Quotation",
    clientName: "BlueStar Realty",
    type: "quotation",
    createdAt: "2026-03-15T13:20:00Z",
    status: "draft",
    version: 1,
  },
];
