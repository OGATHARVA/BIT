export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface Quotation {
  id: string;
  user_id: string;
  title: string;
  client_name: string;
  client_company?: string;
  project_name: string;
  quotation_date: string;
  validity_date: string;
  letterhead_url?: string;
  tax_percent: number;
  tone: 'Formal' | 'Friendly' | 'Professional';
  description_style: 'Short' | 'Medium' | 'Detailed';
  generated_content?: {
    intro: string;
    terms: string;
    closingNote: string;
  };
  status: 'draft' | 'generated' | 'completed';
  version: number;
  created_at: Date;
  updated_at: Date;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  item_name: string;
  quantity: number;
  price: number;
  created_at: Date;
}

export interface Proposal {
  id: string;
  user_id: string;
  template_id: string;
  template_name: string;
  title: string;
  client_name: string;
  client_company?: string;
  project_name: string;
  proposal_date: string;
  validity_date: string;
  prepared_by?: string;
  problem_statement?: string;
  client_requirements?: string;
  objectives?: string;
  notes?: string;
  services: string[];
  deliverables?: string;
  estimated_timeline?: string;
  budget?: string;
  key_features?: string;
  scope_of_work?: string;
  tone: 'Formal' | 'Professional' | 'Persuasive';
  proposal_style: 'Short' | 'Detailed' | 'Executive';
  sections?: ProposalSections;
  status: 'draft' | 'generated' | 'completed';
  version: number;
  created_at: Date;
  updated_at: Date;
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

export interface DocumentItem {
  id: string;
  user_id: string;
  title: string;
  client_name: string;
  type: 'quotation' | 'proposal';
  created_at: Date;
  status: 'draft' | 'generated' | 'completed';
  version: number;
}

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
