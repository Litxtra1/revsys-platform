import { Badge, Card, CardContent, CardHeader, CardTitle } from "@revsys/ui";

interface DemandSource {
  name: string;
  description: string;
}

const SOURCES: DemandSource[] = [
  {
    name: "Content",
    description:
      "Answering real buyer questions brings in visitors who are already close to purchasing.",
  },
  {
    name: "AI Visibility",
    description:
      "Showing up correctly in AI-powered search and shopping assistants puts your store in front of buyers earlier.",
  },
  {
    name: "Search Optimization",
    description:
      "Ranking for the terms your best customers actually search for brings in qualified traffic.",
  },
  {
    name: "Community Engagement",
    description:
      "Being part of the conversations your customers already have builds trust before they visit.",
  },
];

export function DemandCaptureDemo() {
  return (
    <div className="space-y-6">
      <Badge variant="secondary">Coming Soon — Concept Preview</Badge>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Demand already exists. These are the channels Revsys AI will help you capture it through.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {SOURCES.map((source) => (
          <Card key={source.name}>
            <CardHeader>
              <CardTitle className="text-base">{source.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{source.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
