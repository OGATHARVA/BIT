import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface ProposalData {
  id?: string;
  title: string;
  content: string;
  clientName?: string;
  projectType?: string;
  estimatedCost?: number;
  version?: number;
}

interface ProposalPreviewProps {
  proposal: ProposalData | null;
  costEstimates?: any[];
  discountPercent?: number;
  onDiscountChange?: (discount: number) => void;
  onSave?: () => void;
  onCreateVersion?: () => void;
  isLoading?: boolean;
}

export function ProposalPreview({
  proposal,
  costEstimates,
  discountPercent = 0,
  onDiscountChange,
  onSave,
  onCreateVersion,
  isLoading = false,
}: ProposalPreviewProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!proposal) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">Generate a proposal to see preview</p>
        </CardContent>
      </Card>
    );
  }

  const downloadPDF = async () => {
    try {
      setIsDownloading(true);

      if (!proposal) {
        throw new Error('Proposal data not available');
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      // Helper function to add text with wrapping
      const addText = (text: string, fontSize = 12, options = {}) => {
        doc.setFontSize(fontSize);
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.353 + 2; // Convert font size to mm

        if (yPos + lineHeight * lines.length > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }

        doc.text(lines, margin, yPos, options);
        yPos += lineHeight * lines.length + 5;
      };

      // Title
      doc.setFont(undefined, 'bold');
      addText(proposal.title, 18, { maxWidth: contentWidth });

      // Add metadata
      doc.setFont(undefined, 'normal');
      yPos += 10;
      addText(`Client: ${proposal.clientName || 'Not specified'}`, 11);
      addText(`Project Type: ${proposal.projectType || 'Not specified'}`, 11);
      addText(`Generated: ${new Date().toLocaleDateString()}`, 11);

      if (proposal.estimatedCost) {
        doc.setFont(undefined, 'bold');
        addText(`\nEstimated Cost: $${proposal.estimatedCost.toLocaleString()}`, 14);
        
        if (discountPercent > 0) {
          const discountAmount = (proposal.estimatedCost * discountPercent) / 100;
          const finalAmount = proposal.estimatedCost - discountAmount;
          doc.setFont(undefined, 'normal');
          addText(`Discount (${discountPercent}%): -$${discountAmount.toLocaleString()}`, 11);
          doc.setFont(undefined, 'bold');
          addText(`Final Cost: $${finalAmount.toLocaleString()}`, 12);
        }
      }

      // Content
      doc.setFont(undefined, 'normal');
      yPos += 10;
      const contentLines = doc.splitTextToSize(proposal.content, contentWidth);
      contentLines.forEach((line: string) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 7;
      });

      // Save PDF
      const filename = `proposal_${proposal.clientName || 'export'}_${new Date().getTime()}.pdf`;
      doc.save(filename);

      toast({
        title: 'Success! ✅',
        description: 'Proposal PDF downloaded successfully',
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred while generating PDF';
      console.error('PDF download error:', error);
      
      toast({
        title: 'Download Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Proposal Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{proposal.title}</CardTitle>
              <CardDescription className="mt-2">
                {proposal.clientName && <p>Client: {proposal.clientName}</p>}
                {proposal.projectType && <p>Type: {proposal.projectType}</p>}
              </CardDescription>
            </div>
            {proposal.version && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Version</p>
                <p className="text-2xl font-bold text-indigo-600">{proposal.version}</p>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Proposal Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📄 Proposal Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed font-mono">
            {proposal.content}
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      {proposal.estimatedCost && (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total Estimated Cost:</span>
              <span className="text-3xl font-bold text-indigo-600">
                ${proposal.estimatedCost.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={downloadPDF}
          disabled={isDownloading}
          size="lg"
          className="flex-1"
        >
          <span className="mr-2">📥</span>
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>

        {onSave && (
          <Button
            onClick={onSave}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <span className="mr-2">💾</span>
            Save Proposal
          </Button>
        )}

        {onCreateVersion && (
          <Button
            onClick={onCreateVersion}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <span className="mr-2">📝</span>
            Create Version
          </Button>
        )}
      </div>

      {/* Information Box */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-sm text-green-900 font-semibold mb-2">✨ Next Steps</p>
          <ul className="text-sm text-green-800 space-y-2">
            <li>✓ Review the proposal content</li>
            <li>✓ Download as PDF for client</li>
            <li>✓ Save to track versions</li>
            <li>✓ Edit and create new versions as needed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProposalPreview;
