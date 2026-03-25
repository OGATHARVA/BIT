import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadStep = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const el = document.getElementById("quotation-preview");
      if (!el) throw new Error("Preview not found");

      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("quotation.pdf");
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mb-6 inline-flex rounded-full bg-secondary p-6">
        {done ? (
          <CheckCircle2 className="h-12 w-12 text-primary" />
        ) : (
          <Download className="h-12 w-12 text-primary" />
        )}
      </div>
      <h2 className="mb-2 text-2xl font-bold text-foreground">
        {done ? "Download Complete!" : "Download Your Quotation"}
      </h2>
      <p className="mb-8 text-muted-foreground">
        {done
          ? "Your quotation PDF has been downloaded successfully."
          : "Your quotation is ready. Click below to download as a PDF."}
      </p>
      <Button
        onClick={handleDownload}
        disabled={loading}
        size="lg"
        className="gradient-primary text-primary-foreground shadow-primary hover:opacity-90 gap-2 px-10"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
        {loading ? "Generating PDF..." : done ? "Download Again" : "Download PDF"}
      </Button>
    </div>
  );
};

export default DownloadStep;
