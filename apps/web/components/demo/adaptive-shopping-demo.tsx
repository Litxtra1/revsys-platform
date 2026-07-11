import { Badge, Card, CardContent, CardHeader, CardTitle, Muted } from "@revsys/ui";

interface VisitorScenario {
  source: string;
  headline: string;
  message: string;
  why: string;
}

const SCENARIOS: VisitorScenario[] = [
  {
    source: "Arrives From an Instagram Ad",
    headline: "New Arrivals: Trail Running Shoes",
    message: "20% off this week only",
    why: "The ad campaign targeted running shoe shoppers, so the homepage leads with that category and offer.",
  },
  {
    source: "Arrives From a Google Search",
    headline: "Shop Gifts Under $50",
    message: "Curated picks for every budget",
    why: "The search phrase signals gift-shopping intent, so pricing and gift framing are surfaced first.",
  },
];

export function AdaptiveShoppingDemo() {
  return (
    <div className="space-y-6">
      <Badge variant="secondary">Coming Soon — Concept Preview</Badge>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Two visitors land on the same store seconds apart. Each sees a homepage shaped by how they
        arrived, not a generic one.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {SCENARIOS.map((scenario) => (
          <Card key={scenario.source}>
            <CardHeader>
              <Muted>{scenario.source}</Muted>
              <CardTitle className="text-lg">{scenario.headline}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm font-medium">{scenario.message}</p>
              <p className="text-sm text-muted-foreground">{scenario.why}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Matching the first few seconds of a visit to how someone arrived is what improves
        conversion, not just how it looks.
      </p>
    </div>
  );
}
