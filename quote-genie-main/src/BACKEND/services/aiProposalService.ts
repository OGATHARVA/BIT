// AI Service for Automated Proposal & Quotation Generation
import dotenv from 'dotenv';

dotenv.config();

interface ProposalRequest {
  clientName: string;
  projectType: string;
  requirements: string;
  timeline: string;
  budget: string;
  features: string[];
}

interface GeneratedProposal {
  title: string;
  content: string;
  summary: string;
  estimatedCost: number;
}

interface CostEstimate {
  service: string;
  baseCost: number;
  quantity: number;
  complexityFactor: number;
  totalCost: number;
}

// Service database - sample data for cost estimation
const serviceDatabase = {
  web: {
    'UI/UX Design': { base: 2000, unit: 'project' },
    'Frontend Development': { base: 5000, unit: 'month' },
    'Backend Development': { base: 5000, unit: 'month' },
    'Database Design': { base: 1500, unit: 'project' },
    'Testing & QA': { base: 2000, unit: 'project' },
    'Deployment': { base: 1000, unit: 'project' },
    'Maintenance': { base: 500, unit: 'month' },
  },
  mobile: {
    'App Design': { base: 3000, unit: 'project' },
    'iOS Development': { base: 6000, unit: 'month' },
    'Android Development': { base: 6000, unit: 'month' },
    'API Integration': { base: 2000, unit: 'project' },
    'Testing': { base: 2500, unit: 'project' },
    'App Store Deployment': { base: 1500, unit: 'project' },
  },
  design: {
    'Branding': { base: 2000, unit: 'project' },
    'Logo Design': { base: 1000, unit: 'project' },
    'Website Design': { base: 3000, unit: 'project' },
    'Marketing Materials': { base: 2000, unit: 'project' },
  },
};

export class AIProposalService {
  private useAPI: boolean;
  private apiProvider: 'openai' | 'anthropic' | 'mock';

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (openaiKey && openaiKey !== 'sk-xxxxxxxxxxxxxxxxxxxxx') {
      this.useAPI = true;
      this.apiProvider = 'openai';
    } else if (anthropicKey && anthropicKey !== 'sk-ant-xxxxxxxxxxxxxxxxxxxx') {
      this.useAPI = true;
      this.apiProvider = 'anthropic';
    } else {
      this.useAPI = false;
      this.apiProvider = 'mock';
    }

    console.log(`📄 Proposal Generator using: ${this.apiProvider} (${this.useAPI ? 'API' : 'Mock'})`);
  }

  /**
   * Generate a professional proposal based on requirements
   */
  async generateProposal(request: ProposalRequest): Promise<GeneratedProposal> {
    if (this.useAPI && this.apiProvider === 'openai') {
      return this.generateWithOpenAI(request);
    } else if (this.useAPI && this.apiProvider === 'anthropic') {
      return this.generateWithAnthropic(request);
    } else {
      return this.generateMockProposal(request);
    }
  }

  /**
   * Generate proposal using OpenAI API
   */
  private async generateWithOpenAI(request: ProposalRequest): Promise<GeneratedProposal> {
    try {
      // This would use the actual OpenAI API
      // For now, we'll use the mock implementation
      return this.generateMockProposal(request);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateMockProposal(request);
    }
  }

  /**
   * Generate proposal using Anthropic API
   */
  private async generateWithAnthropic(request: ProposalRequest): Promise<GeneratedProposal> {
    try {
      // This would use the actual Anthropic API
      // For now, we'll use the mock implementation
      return this.generateMockProposal(request);
    } catch (error) {
      console.error('Anthropic API error:', error);
      return this.generateMockProposal(request);
    }
  }

  /**
   * Generate a professional mock proposal
   */
  private generateMockProposal(request: ProposalRequest): GeneratedProposal {
    const projectTypeLabel =
      request.projectType === 'web' ? 'Web Application'
        : request.projectType === 'mobile' ? 'Mobile Application'
          : 'Project';

    const title = `${projectTypeLabel} Development Proposal - ${request.clientName}`;

    const content = `
## Project Proposal

### Executive Summary
We are pleased to present this proposal for the development of a comprehensive ${projectTypeLabel.toLowerCase()} for ${request.clientName}. Based on the requirements outlined, we have designed a solution that balances functionality, quality, and cost-effectiveness.

### Project Overview
**Client:** ${request.clientName}
**Project Type:** ${projectTypeLabel}
**Timeline:** ${request.timeline}
**Estimated Budget:** $${this.estimateTotalCost(request)}

### Requirements Analysis
${request.requirements}

### Scope of Work
1. **Design & Planning**
   - Requirement analysis and documentation
   - System architecture design
   - Wireframing and prototyping
   - User experience optimization

2. **Development**
   - Full-stack development
   - API development and integration
   - Database design and optimization
   - Security implementation

3. **Features Included**
   ${request.features.map((f) => `- ${f}`).join('\n   ')}

4. **Quality Assurance**
   - Functional testing
   - Performance optimization
   - Security testing
   - User acceptance testing

5. **Deployment & Delivery**
   - Production deployment
   - Documentation
   - Team training
   - Post-launch support

### Project Timeline
- Week 1-2: Analysis & Design
- Week 3-4: Development Setup
- Week 5-8: Core Development
- Week 9: Testing & QA
- Week 10: Deployment & Launch

### Cost Breakdown
See detailed cost estimation sheet below.

### Support & Maintenance
Post-launch support included for 30 days. Extended support packages available.

### Next Steps
1. Review this proposal
2. Provide feedback and clarifications
3. Sign off on scope and timeline
4. Schedule kickoff meeting

---
**Prepared by:** Quote Genie System
**Date:** ${new Date().toLocaleDateString()}
`;

    return {
      title,
      content,
      summary: `Professional ${projectTypeLabel.toLowerCase()} proposal for ${request.clientName} with comprehensive feature set and professional delivery timeline.`,
      estimatedCost: this.estimateTotalCost(request),
    };
  }

  /**
   * Calculate cost estimation based on project type and features
   */
  async estimateCosts(
    projectType: string,
    features: string[],
    complexity: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<CostEstimate[]> {
    const services = serviceDatabase[projectType as keyof typeof serviceDatabase] || serviceDatabase.web;
    const complexityFactors = { low: 0.8, medium: 1.0, high: 1.5 };
    const factor = complexityFactors[complexity];

    const estimates: CostEstimate[] = [];

    // Select relevant services based on features and project type
    const selectedServices = this.selectRelevantServices(projectType, features);

    for (const service of selectedServices) {
      const serviceData = services[service as keyof typeof services];
      if (serviceData) {
        const baseCost = (serviceData as any).base;
        const quantity = this.estimateQuantity(service, projectType);
        const totalCost = baseCost * quantity * factor;

        estimates.push({
          service,
          baseCost,
          quantity,
          complexityFactor: factor,
          totalCost: Math.round(totalCost),
        });
      }
    }

    return estimates;
  }

  /**
   * Select relevant services based on features
   */
  private selectRelevantServices(projectType: string, features: string[]): string[] {
    const services = serviceDatabase[projectType as keyof typeof serviceDatabase];
    if (!services) return [];

    const allServices = Object.keys(services);
    const relevantCount = Math.min(Math.max(features.length, 3), allServices.length);

    return allServices.slice(0, relevantCount);
  }

  /**
   * Estimate quantity/months needed for a service
   */
  private estimateQuantity(service: string, projectType: string): number {
    const serviceQuantities: Record<string, number> = {
      'UI/UX Design': 1,
      'App Design': 1,
      'Branding': 1,
      'Logo Design': 1,
      'Frontend Development': 2,
      'Backend Development': 2,
      'iOS Development': 2,
      'Android Development': 2,
      'Database Design': 1,
      'API Integration': 1,
      'Testing & QA': 1,
      'Testing': 1,
      'Deployment': 1,
      'App Store Deployment': 1,
    };

    return serviceQuantities[service] || 1;
  }

  /**
   * Calculate total project cost
   */
  private estimateTotalCost(request: ProposalRequest): number {
    const baseAmount = 15000; // Base project cost
    const featureBonus = request.features.length * 2000; // Cost per feature
    const timelineMultiplier = request.timeline.includes('Week') ? 1.0 : 1.5;

    return Math.round((baseAmount + featureBonus) * timelineMultiplier);
  }

  /**
   * Generate proposal title variations
   */
  generateTitleOptions(request: ProposalRequest): string[] {
    const type = request.projectType === 'web' ? 'Web' : request.projectType === 'mobile' ? 'Mobile' : 'Custom';
    const client = request.clientName;

    return [
      `${type} Application Development Proposal - ${client}`,
      `${type} Development Project Proposal for ${client}`,
      `Professional ${type} Solution Proposal - ${client}`,
    ];
  }
}

export const aiProposalService = new AIProposalService();

export default aiProposalService;
