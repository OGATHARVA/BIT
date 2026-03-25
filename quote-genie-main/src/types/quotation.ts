export interface QuotationItem {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface QuotationData {
  letterheadUrl: string | null;
  letterheadFile: File | null;
  clientName: string;
  clientCompany: string;
  projectName: string;
  quotationDate: string;
  validityDate: string;
  validityDays: number;
  items: QuotationItem[];
  taxPercent: number;
  discountPercent: number;
  tone: "Formal" | "Friendly" | "Professional";
  descriptionStyle: "Short" | "Medium" | "Detailed";
  generatedContent: {
    intro: string;
    terms: string;
    closingNote: string;
  } | null;
}

export const defaultQuotationData: QuotationData = {
  letterheadUrl: null,
  letterheadFile: null,
  clientName: "",
  clientCompany: "",
  projectName: "",
  quotationDate: new Date().toISOString().split("T")[0],
  validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  validityDays: 30,
  items: [{ id: "1", itemName: "", quantity: 1, price: 0 }],
  taxPercent: 18,
  discountPercent: 0,
  tone: "Professional",
  descriptionStyle: "Medium",
  generatedContent: null,
};
