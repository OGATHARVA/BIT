export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export const proposalTemplates: ProposalTemplate[] = [
  { id: "it-project", name: "IT Project Proposal", description: "For software development, websites, apps, and digital platforms.", category: "Technology", icon: "💻" },
  { id: "mobile-app", name: "Mobile App Development", description: "For Android, iOS, or cross-platform app projects.", category: "Technology", icon: "📱" },
  { id: "website", name: "Website Development", description: "For business websites, portfolios, ecommerce, and portals.", category: "Technology", icon: "🌐" },
  { id: "ai-automation", name: "AI / Automation Proposal", description: "For AI tools, automation systems, data processing, and smart solutions.", category: "Technology", icon: "🤖" },
  { id: "digital-marketing", name: "Digital Marketing", description: "For SEO, ads, social media, and growth campaigns.", category: "Marketing", icon: "📈" },
  { id: "graphic-design", name: "Graphic Design / Branding", description: "For logo design, branding, UI/UX, and creative services.", category: "Creative", icon: "🎨" },
  { id: "construction", name: "Construction / Infrastructure", description: "For civil work, building projects, site execution, and infrastructure.", category: "Engineering", icon: "🏗️" },
  { id: "water-supply", name: "Water Supply / Service", description: "For tanker supply, utility services, maintenance, and field operations.", category: "Services", icon: "💧" },
  { id: "consulting", name: "Business Consulting", description: "For strategy, operations, advisory, and process improvement projects.", category: "Business", icon: "📊" },
  { id: "custom", name: "Custom Blank Proposal", description: "Start from scratch with fully customizable sections.", category: "Custom", icon: "📝" },
];

export interface PricingItem {
  id: string;
  serviceName: string;
  quantity: number;
  price: number;
}

export interface ProposalSections {
  introduction: string;
  problemStatement: string;
  proposedSolution: string;
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  terms: string;
  conclusion: string;
}

export interface ProposalData {
  templateId: string;
  templateName: string;
  clientName: string;
  clientCompany: string;
  proposalTitle: string;
  projectName: string;
  proposalDate: string;
  preparedBy: string;
  problemStatement: string;
  clientRequirements: string;
  objectives: string;
  notes: string;
  services: string[];
  deliverables: string;
  estimatedTimeline: string;
  budget: string;
  keyFeatures: string;
  scopeOfWork: string;
  tone: "Formal" | "Professional" | "Persuasive";
  proposalStyle: "Short" | "Detailed" | "Executive";
  sections: ProposalSections | null;
  pricingItems: PricingItem[];
  taxPercent: number;
}

export const defaultProposalData: ProposalData = {
  templateId: "",
  templateName: "",
  clientName: "",
  clientCompany: "",
  proposalTitle: "",
  projectName: "",
  proposalDate: new Date().toISOString().split("T")[0],
  preparedBy: "",
  problemStatement: "",
  clientRequirements: "",
  objectives: "",
  notes: "",
  services: [],
  deliverables: "",
  estimatedTimeline: "",
  budget: "",
  keyFeatures: "",
  scopeOfWork: "",
  tone: "Professional",
  proposalStyle: "Detailed",
  sections: null,
  pricingItems: [{ id: "1", serviceName: "", quantity: 1, price: 0 }],
  taxPercent: 0,
};
