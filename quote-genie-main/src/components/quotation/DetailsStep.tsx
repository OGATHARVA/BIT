import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { QuotationData, QuotationItem } from "@/types/quotation";

interface Props {
  data: QuotationData;
  onChange: (updates: Partial<QuotationData>) => void;
}

const DetailsStep = ({ data, onChange }: Props) => {
  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    onChange({
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addItem = () => {
    onChange({
      items: [...data.items, { id: Date.now().toString(), itemName: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ items: data.items.filter((i) => i.id !== id) });
  };

  const subtotal = data.items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const discountAmount = subtotal * (data.discountPercent / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * (data.taxPercent / 100);
  const total = subtotalAfterDiscount + taxAmount;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Quotation Details</h2>
        <p className="text-muted-foreground">Fill in your client and project information.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Client Name</Label>
          <Input value={data.clientName} onChange={(e) => onChange({ clientName: e.target.value })} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label>Client Company</Label>
          <Input value={data.clientCompany} onChange={(e) => onChange({ clientCompany: e.target.value })} placeholder="Acme Corp" />
        </div>
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input value={data.projectName} onChange={(e) => onChange({ projectName: e.target.value })} placeholder="Website Redesign" />
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={data.quotationDate}
            onChange={(e) => {
              const newDate = e.target.value;
              const newValidityDate = new Date(new Date(newDate).getTime() + data.validityDays * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0];
              onChange({ quotationDate: newDate, validityDate: newValidityDate });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Validity Days</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              max={365}
              value={data.validityDays}
              onChange={(e) => {
                const days = Number(e.target.value);
                const newValidityDate = new Date(new Date(data.quotationDate).getTime() + days * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0];
                onChange({ validityDays: days, validityDate: newValidityDate });
              }}
              placeholder="30"
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">days</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Valid until: <span className="font-semibold text-foreground">{data.validityDate || "—"}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">Line Items</h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-24">Qty</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground w-32">Price</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-32">Amount</th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">
                    <Input value={item.itemName} onChange={(e) => updateItem(item.id, "itemName", e.target.value)} placeholder="Service name" className="border-0 bg-transparent p-0 shadow-none" />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} className="border-0 bg-transparent p-0 text-center shadow-none" />
                  </td>
                  <td className="px-4 py-2">
                    <Input type="number" min={0} value={item.price} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))} className="border-0 bg-transparent p-0 text-center shadow-none" />
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-foreground">
                    ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                  </td>
                  <td className="px-2 py-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={addItem}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      {/* Pricing Summary */}
      <div className="ml-auto max-w-xs space-y-3 rounded-xl border bg-muted/30 p-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <div className="flex items-center gap-2">
            <Input
              type="number" min={0} max={100} value={data.discountPercent}
              onChange={(e) => onChange({ discountPercent: Number(e.target.value) })}
              className="h-8 w-16 text-center text-sm"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
        {data.discountPercent > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount Amount</span>
            <span className="font-medium">-₹{discountAmount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <div className="flex items-center gap-2">
            <Input
              type="number" min={0} max={100} value={data.taxPercent}
              onChange={(e) => onChange({ taxPercent: Number(e.target.value) })}
              className="h-8 w-16 text-center text-sm"
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-foreground">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailsStep;
