"use client";

import { useMemo, useState } from "react";
import { calculateRevenueOpportunity } from "@revsys/engines";
import { formatCurrency } from "@revsys/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Input,
  Label,
  Lead,
} from "@revsys/ui";

const DEFAULTS = {
  monthlyVisitors: 10000,
  conversionRatePercent: 2,
  averageOrderValue: 65,
};

export default function CalculatorPage() {
  const [monthlyVisitors, setMonthlyVisitors] = useState(DEFAULTS.monthlyVisitors);
  const [conversionRatePercent, setConversionRatePercent] = useState(
    DEFAULTS.conversionRatePercent
  );
  const [averageOrderValue, setAverageOrderValue] = useState(DEFAULTS.averageOrderValue);

  const result = useMemo(
    () =>
      calculateRevenueOpportunity({ monthlyVisitors, conversionRatePercent, averageOrderValue }),
    [monthlyVisitors, conversionRatePercent, averageOrderValue]
  );

  return (
    <Container className="space-y-10 py-16">
      <div className="text-center">
        <Heading level={1}>Revenue Calculator</Heading>
        <Lead className="mx-auto mt-4 max-w-xl">
          Estimate how much revenue your store could be leaving on the table.
        </Lead>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Store</CardTitle>
            <CardDescription>Enter your current numbers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthlyVisitors">Monthly Visitors</Label>
              <Input
                id="monthlyVisitors"
                type="number"
                min={0}
                value={monthlyVisitors}
                onChange={(event) => setMonthlyVisitors(Number(event.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
              <Input
                id="conversionRate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={conversionRatePercent}
                onChange={(event) => setConversionRatePercent(Number(event.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aov">Average Order Value ($)</Label>
              <Input
                id="aov"
                type="number"
                min={0}
                step={0.01}
                value={averageOrderValue}
                onChange={(event) => setAverageOrderValue(Number(event.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Revenue Opportunity</CardTitle>
            <CardDescription>Based on industry benchmark improvement potential.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Monthly Revenue</span>
              <span className="text-lg font-semibold">
                {formatCurrency(result.currentMonthlyRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Potential Monthly Revenue</span>
              <span className="text-lg font-semibold text-success">
                {formatCurrency(result.potentialMonthlyRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Estimated Revenue Leakage</span>
              <span className="text-lg font-semibold text-destructive">
                {formatCurrency(result.estimatedRevenueLeakage)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Potential Revenue Recovery</span>
              <span className="text-lg font-semibold">
                {formatCurrency(result.potentialRevenueRecovery)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
        These figures are benchmark-based estimates, not an analysis of your actual store. Connect
        your Shopify store for a Revenue Report specific to your business.
      </p>
    </Container>
  );
}
