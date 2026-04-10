import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import type { ProposalData } from "@/types/proposal";

interface Props {
  data: ProposalData;
}

const sectionOrder: { key: keyof NonNullable<ProposalData["sections"]>; title: string }[] = [
  { key: "introduction", title: "Introduction" },
  { key: "problemStatement", title: "Problem Statement" },
  { key: "proposedSolution", title: "Proposed Solution" },
  { key: "scopeOfWork", title: "Scope of Work" },
  { key: "deliverables", title: "Deliverables" },
  { key: "timeline", title: "Timeline" },
  { key: "pricing", title: "Pricing Summary" },
  { key: "terms", title: "Terms & Conditions" },
  { key: "conclusion", title: "Conclusion" },
];

const ProposalPreviewStep = ({ data }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const el = document.getElementById("proposal-preview");
      if (!el) {
        throw new Error("Preview element not found in the page");
      }

      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      if (!canvas) {
        throw new Error("Failed to generate canvas from preview");
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`proposal_${data.clientName || "proposal"}.pdf`);
      
      setDone(true);
      toast({
        title: "Success! ✅",
        description: "Proposal PDF downloaded successfully",
      });
    } catch (err: any) {
      console.error("Download error:", err);
      toast({
        title: "Download Failed",
        description: err.message || "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Preview & Download</h2>
        <Button
          onClick={handleDownload}
          disabled={loading}
          className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : done ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {loading ? "Generating..." : done ? "Download Again" : "Download PDF"}
        </Button>
      </div>

      <div
        id="proposal-preview"
        className="mx-auto rounded-lg border bg-background p-10 shadow-card"
        style={{ maxWidth: "210mm", fontFamily: "Inter, sans-serif" }}
      >
        {/* Title Page */}
        <div className="mb-10 border-b-2 border-primary/20 pb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{data.proposalTitle || "Business Proposal"}</h1>
          <p className="text-lg text-muted-foreground">{data.projectName}</p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Prepared for: <span className="font-medium text-foreground">{data.clientName || "—"}</span> — {data.clientCompany || "—"}</p>
            <p>Prepared by: <span className="font-medium text-foreground">{data.preparedBy || "—"}</span></p>
            <p className="mt-2">Date: {data.proposalDate}</p>
          </div>
        </div>

        {/* Sections */}
        {data.sections && sectionOrder.map(({ key, title }) => (
          data.sections![key] && (
            <div key={key} className="mb-8">
              <h2 className="mb-3 border-b border-primary/10 pb-1 text-lg font-bold text-foreground">{title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80">{data.sections![key]}</p>
            </div>
          )
        ))}

        {/* Pricing Summary Table - Only show if items have been filled */}
        {data.pricingItems.length > 0 && data.pricingItems.some(item => item.serviceName && item.price > 0) && (
          <div className="mb-8">
            <h2 className="mb-3 border-b border-primary/10 pb-1 text-lg font-bold text-foreground">Pricing Breakdown</h2>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Service</th>
                  <th className="text-center py-2 font-semibold">Qty</th>
                  <th className="text-right py-2 font-semibold">Unit Price</th>
                  <th className="text-right py-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.pricingItems.filter(item => item.serviceName && item.price > 0).map((item) => {
                  const itemTotal = item.quantity * item.price;
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.serviceName}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">₹{item.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                      <td className="text-right py-2 font-medium">₹{itemTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="space-y-1 text-sm">
              {(() => {
                const subtotal = data.pricingItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
                const taxAmount = subtotal * (data.taxPercent / 100);
                const total = subtotal + taxAmount;

                return (
                  <>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                    {data.taxPercent > 0 && (
                      <div className="flex justify-between">
                        <span>Tax ({data.taxPercent}%):</span>
                        <span className="font-medium">₹{taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-1 font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 border-t pt-4 text-center text-xs text-muted-foreground">
          <p>This proposal is confidential and intended solely for {data.clientCompany || "the recipient"}.</p>
          <p className="mt-1">Generated with Quotify</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalPreviewStep;
