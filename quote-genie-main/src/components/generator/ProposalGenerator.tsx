import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequirementForm from './RequirementForm';
import CostEstimator from './CostEstimator';
import ProposalPreview from './ProposalPreview';
import VersionHistory from './VersionHistory';

interface GeneratedProposal {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  estimatedCost?: number;
  clientName?: string;
  projectType?: string;
  costEstimates?: any[];
  version?: number;
}

export function ProposalGenerator() {
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [costEstimates, setCostEstimates] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);

  // Load saved proposals when component mounts
  useEffect(() => {
    loadSavedProposals();
  }, []);

  const loadSavedProposals = async () => {
    try {
      const response = await apiClient.getSavedProposals();
      // Initialize with empty state - database integration needed
    } catch (error) {
      console.error('Error loading proposals:', error);
    }
  };

  const handleGenerateProposal = async (formData: any) => {
    try {
      setIsGenerating(true);

      // Generate proposal
      const proposalResponse = await apiClient.generateProposal({
        clientName: formData.clientName,
        projectType: formData.projectType,
        requirements: formData.requirements,
        timeline: formData.timeline,
        budget: formData.budget,
        features: formData.features,
        complexity: formData.complexity,
      });

      // Generate cost estimates
      const costResponse = await apiClient.estimateCosts({
        projectType: formData.projectType,
        features: formData.features,
        complexity: formData.complexity,
      });

      setProposal({
        title: proposalResponse.proposal.title,
        content: proposalResponse.proposal.content,
        summary: proposalResponse.proposal.summary,
        estimatedCost: proposalResponse.proposal.estimatedCost,
        clientName: formData.clientName,
        projectType: formData.projectType,
        costEstimates: costResponse.estimates,
        version: 1,
      });

      setCostEstimates(costResponse.estimates);
      setTotalCost(costResponse.totalCost);
      setCostBreakdown(costResponse.breakdown);
      setVersions([]);

      toast({
        title: 'Success! 🎉',
        description: 'Proposal generated successfully',
      });

      // Auto-switch to preview tab
      setActiveTab('preview');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate proposal',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProposal = async () => {
    if (!proposal) {
      toast({
        title: 'Error',
        description: 'No proposal to save',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);

      await apiClient.saveProposal({
        title: proposal.title,
        clientName: proposal.clientName,
        content: proposal.content,
        costEstimates,
        projectType: proposal.projectType,
      });

      toast({
        title: 'Success',
        description: 'Proposal saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save proposal',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateVersion = async () => {
    if (!proposal) {
      toast({
        title: 'Error',
        description: 'No proposal to version',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);

      // Add new version locally
      const newVersion = (proposal.version || 1) + 1;
      setProposal((prev) =>
        prev
          ? {
              ...prev,
              version: newVersion,
            }
          : null
      );

      // Add to versions list
      setVersions((prev) => [
        ...prev,
        {
          version_number: newVersion,
          title: proposal.title,
          created_at: new Date(),
          change_notes: 'New version created',
        },
      ]);

      toast({
        title: 'Success',
        description: `Version ${newVersion} created`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create version',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✨ Automated Proposal & Quotation Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate professional proposals, cost estimates, and quotations in minutes
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">📋</p>
                <p className="font-semibold text-sm">Requirements Form</p>
                <p className="text-xs text-gray-500 mt-1">Gather project details</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">🤖</p>
                <p className="font-semibold text-sm">AI Generation</p>
                <p className="text-xs text-gray-500 mt-1">Smart proposal creation</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">💰</p>
                <p className="font-semibold text-sm">Cost Estimation</p>
                <p className="text-xs text-gray-500 mt-1">Detailed pricing breakdown</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">📥</p>
                <p className="font-semibold text-sm">Download PDF</p>
                <p className="text-xs text-gray-500 mt-1">Professional documents</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">📋 Requirements</TabsTrigger>
            <TabsTrigger value="preview" disabled={!proposal}>
              📄 Preview
            </TabsTrigger>
            <TabsTrigger value="costs" disabled={!proposal}>
              💰 Costs
            </TabsTrigger>
            <TabsTrigger value="versions" disabled={versions.length === 0}>
              📝 Versions
            </TabsTrigger>
          </TabsList>

          {/* Tab: Requirements Form */}
          <TabsContent value="form" className="space-y-6">
            <RequirementForm
              onSubmit={handleGenerateProposal}
              isLoading={isGenerating}
            />

            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-base">💡 Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Be specific about your project requirements</li>
                  <li>✓ Select all relevant features for accurate costing</li>
                  <li>✓ Higher complexity levels adjust pricing accordingly</li>
                  <li>✓ Timeline and budget help refine the proposal</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Proposal Preview */}
          <TabsContent value="preview" className="space-y-6">
            <ProposalPreview
              proposal={proposal}
              costEstimates={costEstimates}
              discountPercent={discountPercent}
              onDiscountChange={setDiscountPercent}
              onSave={handleSaveProposal}
              onCreateVersion={handleCreateVersion}
              isLoading={isSaving}
            />
          </TabsContent>

          {/* Tab: Cost Estimation */}
          <TabsContent value="costs" className="space-y-6">
            <CostEstimator
              estimates={costEstimates}
              totalCost={totalCost}
              breakdown={costBreakdown}
              discountPercent={discountPercent}
              onDiscountChange={setDiscountPercent}
            />
          </TabsContent>

          {/* Tab: Version History */}
          <TabsContent value="versions" className="space-y-6">
            <VersionHistory versions={versions} currentVersion={proposal?.version} />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🎯 Purpose</h3>
                <p className="text-sm text-gray-600">
                  Streamline your proposal creation process and deliver professional documents faster
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Benefits</h3>
                <p className="text-sm text-gray-600">
                  Save time, ensure consistency, reduce errors, and impress clients with quality proposals
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔄 Workflow</h3>
                <p className="text-sm text-gray-600">
                  Form → Generate → Review → Save → Track Versions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProposalGenerator;
