import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import type { QuotationData } from "@/types/quotation";

interface Props {
  data: QuotationData;
}

const PreviewStep = ({ data }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const el = document.getElementById("quotation-preview");
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
      pdf.save(`quotation_${data.clientName || "quotation"}.pdf`);
      
      setDone(true);
      toast({
        title: "Success! ✅",
        description: `Quotation PDF downloaded successfully`,
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
  const subtotal = data.items.reduce((s, i) => s + i.quantity * i.price, 0);
  const discountAmount = subtotal * (data.discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (data.taxPercent / 100);
  const total = subtotalAfterDiscount + taxAmount;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Preview Your Quotation</h2>
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
        id="quotation-preview"
        className="mx-auto rounded-lg border bg-background p-10 shadow-card"
        style={{ maxWidth: "210mm", fontFamily: "Inter, sans-serif" }}
      >
        {/* Letterhead */}
        {data.letterheadUrl && data.letterheadFile?.type.startsWith("image/") && (
          <div className="mb-6 border-b pb-4">
            <img src={data.letterheadUrl} alt="Letterhead" className="max-h-24 object-contain" />
          </div>
        )}

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">QUOTATION</h1>
          <p className="text-sm text-muted-foreground">
            Date: {data.quotationDate} &nbsp;|&nbsp; Valid Until: {data.validityDate || "N/A"} ({data.validityDays} days)
          </p>
        </div>

        {/* Client Info */}
        <div className="mb-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-muted-foreground">Bill To:</p>
            <p className="font-medium text-foreground">{data.clientName || "—"}</p>
            <p className="text-muted-foreground">{data.clientCompany || "—"}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-muted-foreground">Project:</p>
            <p className="font-medium text-foreground">{data.projectName || "—"}</p>
          </div>
        </div>

        {/* Intro */}
        {data.generatedContent?.intro && (
          <div className="mb-6 whitespace-pre-line text-sm text-foreground">{data.generatedContent.intro}</div>
        )}

        {/* Items Table */}
        <table className="mb-6 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-primary/20">
              <th className="py-2 text-left font-semibold text-foreground">#</th>
              <th className="py-2 text-left font-semibold text-foreground">Item</th>
              <th className="py-2 text-center font-semibold text-foreground">Qty</th>
              <th className="py-2 text-right font-semibold text-foreground">Price</th>
              <th className="py-2 text-right font-semibold text-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 text-muted-foreground">{i + 1}</td>
                <td className="py-2 text-foreground">{item.itemName || "—"}</td>
                <td className="py-2 text-center text-foreground">{item.quantity}</td>
                <td className="py-2 text-right text-foreground">₹{item.price.toLocaleString("en-IN")}</td>
                <td className="py-2 text-right font-medium text-foreground">
                  ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mb-8 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          {data.discountPercent > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({data.discountPercent}%)</span>
              <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({data.taxPercent}%)</span>
            <span className="text-foreground">₹{taxAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Terms */}
        {data.generatedContent?.terms && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Terms & Conditions</h3>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{data.generatedContent.terms}</p>
          </div>
        )}

        {/* Closing */}
        {data.generatedContent?.closingNote && (
          <div className="mt-8 border-t pt-4 text-sm text-foreground">
            {data.generatedContent.closingNote}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewStep;
