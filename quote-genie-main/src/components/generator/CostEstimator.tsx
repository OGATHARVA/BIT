import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CostEstimate {
  service: string;
  baseCost: number;
  quantity: number;
  complexityFactor: number;
  totalCost: number;
}

interface CostBreakdown {
  laborCost: number;
  overheadCost: number;
  profitMargin: number;
}

interface CostEstimatorProps {
  estimates?: CostEstimate[];
  totalCost?: number;
  breakdown?: CostBreakdown;
  loading?: boolean;
  discountPercent?: number;
  onDiscountChange?: (discount: number) => void;
}

export function CostEstimator({
  estimates,
  totalCost,
  breakdown,
  loading = false,
  discountPercent = 0,
  onDiscountChange,
}: CostEstimatorProps) {
  const [displayEstimates, setDisplayEstimates] = useState<CostEstimate[]>(estimates || []);
  const [displayTotalCost, setDisplayTotalCost] = useState(totalCost || 0);
  const [displayBreakdown, setDisplayBreakdown] = useState(
    breakdown || {
      laborCost: 0,
      overheadCost: 0,
      profitMargin: 0,
    }
  );

  useEffect(() => {
    if (estimates) setDisplayEstimates(estimates);
    if (totalCost) setDisplayTotalCost(totalCost);
    if (breakdown) setDisplayBreakdown(breakdown);
  }, [estimates, totalCost, breakdown]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Calculating cost estimates...</p>
        </CardContent>
      </Card>
    );
  }

  if (!displayEstimates || displayEstimates.length === 0) {
    return null;
  }

  const getLaborPercentage = () => {
    if (displayTotalCost === 0) return 0;
    return ((displayBreakdown.laborCost / displayTotalCost) * 100).toFixed(0);
  };

  const getOverheadPercentage = () => {
    if (displayTotalCost === 0) return 0;
    return ((displayBreakdown.overheadCost / displayTotalCost) * 100).toFixed(0);
  };

  const getProfitPercentage = () => {
    if (displayTotalCost === 0) return 0;
    return ((displayBreakdown.profitMargin / displayTotalCost) * 100).toFixed(0);
  };

  const discountAmount = (displayTotalCost * discountPercent) / 100;
  const finalTotal = displayTotalCost - discountAmount;

  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Cost Estimation Summary</CardTitle>
          <CardDescription>Detailed breakdown of project costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Total */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-indigo-200">
            <p className="text-gray-600 text-sm">Estimated Project Cost</p>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              ${displayTotalCost.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Based on selected complexity level and features
            </p>
          </div>

          {/* Discount Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 text-sm font-semibold">Special Discount</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => onDiscountChange?.(Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-green-300 rounded text-center text-sm"
                />
                <span className="text-gray-600">%</span>
              </div>
            </div>
            {discountPercent > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount Amount:</span>
                  <span className="font-semibold text-green-600">-${discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-green-200">
                  <span className="font-semibold text-gray-700">Final Total:</span>
                  <span className="text-xl font-bold text-green-600">${finalTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-emerald-700 font-semibold">Labor Costs</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-2">
                    ${displayBreakdown.laborCost.toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {getLaborPercentage()}% of total
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-amber-700 font-semibold">Overhead</p>
                  <p className="text-2xl font-bold text-amber-600 mt-2">
                    ${displayBreakdown.overheadCost.toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {getOverheadPercentage()}% of total
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-purple-700 font-semibold">Profit Margin</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    ${displayBreakdown.profitMargin.toLocaleString()}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {getProfitPercentage()}% of total
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Services Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Items</CardTitle>
          <CardDescription>{displayEstimates.length} services included</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Base Cost</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-center">Complexity</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayEstimates.map((estimate, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{estimate.service}</TableCell>
                    <TableCell className="text-right">
                      ${estimate.baseCost.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">{estimate.quantity}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {(estimate.complexityFactor * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-indigo-600">
                      ${estimate.totalCost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer with total */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-lg font-bold">
            <span>Total Estimated Cost:</span>
            <span className="text-indigo-600 text-2xl">
              ${displayTotalCost.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Information Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 font-semibold mb-2">💡 About This Estimate</p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Cost estimates are based on project complexity and selected features</li>
            <li>• Labor costs represent 70% of the total project cost</li>
            <li>• Final pricing may vary based on specific requirements and market conditions</li>
            <li>• Estimates are valid for 30 days from generation date</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default CostEstimator;
