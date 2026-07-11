import { Badge, Card, CardContent, CardHeader, CardTitle } from "@revsys/ui";
import { formatCurrency } from "@revsys/shared";
import type { MockRevenueLeak } from "@revsys/engines";
import { SeverityBadge } from "./severity-badge";

export function RevenueLeakCard({ leak }: { leak: MockRevenueLeak }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <Badge variant="outline" className="mb-2">
            {leak.category}
          </Badge>
          <CardTitle className="text-base">{leak.title}</CardTitle>
        </div>
        <SeverityBadge severity={leak.severity} />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{leak.description}</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {leak.evidence.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">Estimated impact</span>
          <span className="font-medium">
            {formatCurrency(leak.estimatedImpactLow)} – {formatCurrency(leak.estimatedImpactHigh)}
            /mo
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
