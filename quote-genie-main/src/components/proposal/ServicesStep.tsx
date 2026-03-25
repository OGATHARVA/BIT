import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { ProposalData, PricingItem } from "@/types/proposal";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const ServicesStep = ({ data, onChange }: Props) => {
  const [serviceInput, setServiceInput] = useState("");

  const addService = () => {
    const trimmed = serviceInput.trim();
    if (trimmed && !data.services.includes(trimmed)) {
      onChange({ services: [...data.services, trimmed] });
      setServiceInput("");
    }
  };

  const removeService = (s: string) => {
    onChange({ services: data.services.filter((x) => x !== s) });
  };

  const updatePricingItem = (id: string, field: keyof PricingItem, value: string | number) => {
    onChange({
      pricingItems: data.pricingItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addPricingItem = () => {
    onChange({
      pricingItems: [...data.pricingItems, { id: Date.now().toString(), serviceName: "", quantity: 1, price: 0 }],
    });
  };

  const removePricingItem = (id: string) => {
    if (data.pricingItems.length <= 1) return;
    onChange({ pricingItems: data.pricingItems.filter((i) => i.id !== id) });
  };

  const subtotal = data.pricingItems.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const taxAmount = subtotal * (data.taxPercent / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Services & Pricing</h2>
        <p className="text-muted-foreground">Outline your proposed services and provide detailed pricing breakdown.</p>
      </div>

      {/* Services tags */}
      <div className="space-y-2">
        <Label>Services Offered</Label>
        <div className="flex gap-2">
          <Input
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
            placeholder="Type a service and press Enter"
          />
          <Button variant="outline" size="icon" onClick={addService}><Plus className="h-4 w-4" /></Button>
        </div>
        {data.services.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {data.services.map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-1">
                {s}
                <button onClick={() => removeService(s)} className="ml-1 rounded-full p-0.5 hover:bg-muted">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Pricing Items Table */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Pricing Details</Label>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Service Name</th>
                <th className="px-4 py-2 text-center font-medium w-20">Qty</th>
                <th className="px-4 py-2 text-right font-medium w-32">Unit Price</th>
                <th className="px-4 py-2 text-right font-medium w-32">Total</th>
                <th className="px-4 py-2 text-center font-medium w-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.pricingItems.map((item) => {
                const itemTotal = item.quantity * item.price;
                return (
                  <tr key={item.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Input
                        value={item.serviceName}
                        onChange={(e) => updatePricingItem(item.id, "serviceName", e.target.value)}
                        placeholder="e.g., Web Development"
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updatePricingItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                        className="h-8 text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min="0"
                        step="100"
                        value={item.price}
                        onChange={(e) => updatePricingItem(item.id, "price", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="h-8 text-right"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{itemTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removePricingItem(item.id)}
                        disabled={data.pricingItems.length === 1}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Button onClick={addPricingItem} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Service Line
        </Button>
      </div>

      {/* Pricing Summary Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-lg">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>

            {data.taxPercent > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax ({data.taxPercent}%):</span>
                <span className="font-medium">₹{taxAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-2 text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-indigo-600">₹{total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Control */}
      <div className="space-y-2">
        <Label>Tax (%)</Label>
        <Input
          type="number"
          min="0"
          max="100"
          step="0.5"
          value={data.taxPercent}
          onChange={(e) => onChange({ taxPercent: parseFloat(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      {/* Other Details */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>Deliverables</Label>
          <Textarea rows={3} value={data.deliverables} onChange={(e) => onChange({ deliverables: e.target.value })} placeholder="List the key deliverables..." />
        </div>
        <div className="space-y-2">
          <Label>Estimated Timeline</Label>
          <Input value={data.estimatedTimeline} onChange={(e) => onChange({ estimatedTimeline: e.target.value })} placeholder="e.g., 8 weeks" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Key Features</Label>
          <Textarea rows={3} value={data.keyFeatures} onChange={(e) => onChange({ keyFeatures: e.target.value })} placeholder="Highlight key features of your solution..." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Scope of Work</Label>
          <Textarea rows={4} value={data.scopeOfWork} onChange={(e) => onChange({ scopeOfWork: e.target.value })} placeholder="Define the detailed scope of work..." />
        </div>
      </div>
    </div>
  );
};

export default ServicesStep;
