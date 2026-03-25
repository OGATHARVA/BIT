import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { aiProposalService } from '../services/aiProposalService.js';

const router = Router();

interface GenerationRequest {
  clientName: string;
  projectType: string;
  requirements: string;
  timeline: string;
  budget: string;
  features: string[];
  complexity?: 'low' | 'medium' | 'high';
}

/**
 * POST /api/generator/generate
 * Generate a new proposal with AI assistance
 */
router.post('/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { clientName, projectType, requirements, timeline, budget, features, complexity } =
      req.body as GenerationRequest;

    // Validation
    if (!clientName || !projectType || !requirements) {
      return res.status(400).json({
        error: 'Missing required fields: clientName, projectType, requirements',
      });
    }

    // Generate proposal using AI service
    const proposal = await aiProposalService.generateProposal({
      clientName,
      projectType,
      requirements,
      timeline: timeline || 'To be determined',
      budget: budget || 'As quoted',
      features: features || [],
    });

    // Generate cost estimates
    const costEstimates = await aiProposalService.estimateCosts(
      projectType,
      features || [],
      complexity || 'medium'
    );

    // TODO: Save to database
    const proposalId = Date.now().toString();

    res.status(201).json({
      message: 'Proposal generated successfully',
      proposal: {
        id: proposalId,
        ...proposal,
        costEstimates,
        clientName,
        projectType,
        version: 1,
        generatedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Error generating proposal:', error);
    res.status(500).json({
      error: 'Failed to generate proposal',
      details: error.message,
    });
  }
});

/**
 * POST /api/generator/estimate-costs
 * Get cost estimation for a project
 */
router.post('/estimate-costs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { projectType, features, complexity } = req.body;

    if (!projectType) {
      return res.status(400).json({ error: 'Missing projectType' });
    }

    const estimates = await aiProposalService.estimateCosts(
      projectType,
      features || [],
      complexity || 'medium'
    );

    const totalCost = estimates.reduce((sum, e) => sum + e.totalCost, 0);

    res.json({
      message: 'Cost estimation calculated',
      estimates,
      totalCost,
      breakdown: {
        laborCost: Math.round(totalCost * 0.7),
        overheadCost: Math.round(totalCost * 0.2),
        profitMargin: Math.round(totalCost * 0.1),
      },
    });
  } catch (error: any) {
    console.error('Error estimating costs:', error);
    res.status(500).json({
      error: 'Failed to estimate costs',
      details: error.message,
    });
  }
});

/**
 * GET /api/generator/templates
 * Get available proposal templates by project type
 */
router.get('/templates', authenticateToken, (req: Request, res: Response) => {
  try {
    const templates = {
      web: {
        name: 'Web Application Development',
        description: 'Standard web application template',
        fields: [
          'Client Name',
          'Project Overview',
          'Required Features',
          'Timeline',
          'Budget',
          'Technical Stack',
        ],
        exampleFeatures: [
          'User Authentication',
          'Dashboard',
          'Data Analytics',
          'Mobile Responsive',
          'Payment Integration',
        ],
      },
      mobile: {
        name: 'Mobile Application Development',
        description: 'iOS and Android app development template',
        fields: [
          'Client Name',
          'Target Platforms',
          'Core Features',
          'Timeline',
          'Budget',
          'Platforms (iOS/Android)',
        ],
        exampleFeatures: [
          'Native Performance',
          'Offline Support',
          'Push Notifications',
          'Social Integration',
          'Analytics',
        ],
      },
      design: {
        name: 'Design & Branding',
        description: 'UI/UX and branding services template',
        fields: [
          'Client Name',
          'Design Scope',
          'Style Preferences',
          'Timeline',
          'Budget',
        ],
        exampleFeatures: [
          'Logo Design',
          'Brand Guidelines',
          'Website Design',
          'UI Components',
          'Marketing Materials',
        ],
      },
      consulting: {
        name: 'Technology Consulting',
        description: 'Technology consulting and strategy template',
        fields: [
          'Client Name',
          'Consulting Focus',
          'Current Challenges',
          'Goals',
          'Timeline',
          'Budget',
        ],
        exampleFeatures: [
          'Technology Audit',
          'Strategy Document',
          'Roadmap Planning',
          'Team Training',
          'Implementation Support',
        ],
      },
    };

    res.json({
      message: 'Available templates',
      templates,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

/**
 * GET /api/generator/complexity-levels
 * Get complexity levels and their impact on pricing
 */
router.get('/complexity-levels', authenticateToken, (req: Request, res: Response) => {
  try {
    const levels = [
      {
        id: 'low',
        name: 'Low Complexity',
        description: 'Simple project with basic features',
        factor: 0.8,
        examples: ['Portfolio sites', 'Simple landing pages', 'Basic CRUD apps'],
      },
      {
        id: 'medium',
        name: 'Medium Complexity',
        description: 'Standard project with moderate features',
        factor: 1.0,
        examples: ['E-commerce sites', 'SaaS applications', 'Content management systems'],
      },
      {
        id: 'high',
        name: 'High Complexity',
        description: 'Complex project with advanced features',
        factor: 1.5,
        examples: [
          'Real-time applications',
          'AI integration',
          'Marketplace platforms',
          'Enterprise systems',
        ],
      },
    ];

    res.json({
      message: 'Complexity levels',
      levels,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complexity levels' });
  }
});

/**
 * POST /api/generator/save-proposal
 * Save generated proposal to database
 */
router.post('/save-proposal', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, clientName, content, costEstimates, projectType } = req.body;

    // TODO: Save to database using database.ts query function
    const proposalId = Date.now().toString();

    res.status(201).json({
      message: 'Proposal saved successfully',
      proposalId,
      version: 1,
      savedAt: new Date(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to save proposal',
      details: error.message,
    });
  }
});

/**
 * GET /api/generator/proposals
 * Get all saved proposals for user
 */
router.get('/proposals', authenticateToken, (req: Request, res: Response) => {
  try {
    // TODO: Query from database
    res.json({
      message: 'User proposals',
      proposals: [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposals' });
  }
});

/**
 * GET /api/generator/proposals/:id
 * Get specific proposal with all versions
 */
router.get('/proposals/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Query from database
    res.json({
      message: 'Proposal details',
      proposal: {
        id,
        versions: [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
});

/**
 * POST /api/generator/proposals/:id/version
 * Create a new version of a proposal
 */
router.post('/proposals/:id/version', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, changeNotes } = req.body;

    if (!content || !changeNotes) {
      return res.status(400).json({ error: 'Missing content or changeNotes' });
    }

    // TODO: Save new version to database

    res.status(201).json({
      message: 'Proposal version created',
      versionNumber: 2,
      createdAt: new Date(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create proposal version',
      details: error.message,
    });
  }
});

/**
 * DELETE /api/generator/proposals/:id
 * Delete a proposal
 */
router.delete('/proposals/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Delete from database

    res.json({
      message: 'Proposal deleted successfully',
      id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete proposal' });
  }
});

export default router;
