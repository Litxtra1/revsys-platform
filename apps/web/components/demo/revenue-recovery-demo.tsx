import { ArrowRight } from "lucide-react";
import { Card, CardContent, Muted } from "@revsys/ui";

interface RecoveryScenario {
  before: string;
  action: string;
  after: string;
}

const SCENARIOS: RecoveryScenario[] = [
  {
    before: "A five-step checkout with no guest option was driving abandonment.",
    action: "Cut checkout to two steps and added guest checkout.",
    after: "More visitors completed their purchase instead of dropping off.",
  },
  {
    before: "Mobile pages loaded slowly and tap targets were too small.",
    action: "Compressed assets and resized buttons for mobile.",
    after: "Mobile visitors converted closer to the desktop rate.",
  },
  {
    before: "Product pages had no reviews or trust signals.",
    action: "Added reviews and trust badges near the buy button.",
    after: "New visitors converted with more confidence on the first visit.",
  },
];

export function RevenueRecoveryDemo() {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Every detected Revenue Leak becomes a prioritized recommendation. Here is what that looks
        like in practice.
      </p>
      <div className="space-y-4">
        {SCENARIOS.map((scenario) => (
          <Card key={scenario.before}>
            <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
              <div>
                <Muted>Before</Muted>
                <p className="text-sm">{scenario.before}</p>
              </div>
              <ArrowRight
                className="hidden h-4 w-4 text-muted-foreground md:block"
                aria-hidden="true"
              />
              <div>
                <Muted>Action</Muted>
                <p className="text-sm">{scenario.action}</p>
              </div>
              <ArrowRight
                className="hidden h-4 w-4 text-muted-foreground md:block"
                aria-hidden="true"
              />
              <div>
                <Muted>After</Muted>
                <p className="text-sm">{scenario.after}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
