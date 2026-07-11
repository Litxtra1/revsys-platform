import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Muted,
  Text,
} from "@revsys/ui";
import { formatCurrency } from "@revsys/shared";
import type { MockRevenueReport } from "@revsys/engines";
import { RevenueHealthGauge } from "./revenue-health-gauge";
import { RevenueLeakCard } from "./revenue-leak-card";
import { SeverityBadge } from "./severity-badge";

export interface RevenueReportViewProps {
  report: MockRevenueReport;
  /** "standalone" renders the full report page (header + CTAs); "embedded" is used elsewhere. */
  variant?: "standalone" | "embedded";
}

export function RevenueReportView({ report, variant = "standalone" }: RevenueReportViewProps) {
  const content = (
    <div className="space-y-12">
      {variant === "standalone" ? (
        <div className="space-y-2 text-center">
          <Badge variant="outline">Revenue Report</Badge>
          <Heading level={1}>{report.storeUrl}</Heading>
          <Muted>Generated {new Date(report.generatedAt).toLocaleString()}</Muted>
        </div>
      ) : null}

      {/* Money first. */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <Muted>Estimated Monthly Revenue Opportunity</Muted>
            <p className="mt-2 text-4xl font-semibold text-success">
              {formatCurrency(report.revenueEstimate.monthlyOpportunity)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Muted>Estimated Revenue Leakage</Muted>
            <p className="mt-2 text-4xl font-semibold text-destructive">
              {formatCurrency(report.revenueEstimate.monthlyLeakage)}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <Heading level={2}>Top Revenue Leaks</Heading>
        <div className="grid gap-4 md:grid-cols-2">
          {report.leaks.map((leak) => (
            <RevenueLeakCard key={leak.id} leak={leak} />
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Business Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>{report.businessImpactSummary}</Text>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Opportunities</CardTitle>
          <CardDescription>
            Estimated potential monthly recovery:{" "}
            {formatCurrency(report.recoveryOpportunities.totalPotentialRecovery)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {report.recoveryOpportunities.topOpportunities.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <Heading level={2}>Revenue Health</Heading>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-6 md:col-span-1">
            <RevenueHealthGauge score={report.revenueHealth.overallScore} />
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
            {Object.entries(report.revenueHealth.categoryScores).map(([category, score]) => (
              <Card key={category}>
                <CardContent className="flex items-center justify-between p-4">
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-sm text-muted-foreground">{score}/100</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <Heading level={2}>Recommendations</Heading>
        <div className="grid gap-4 md:grid-cols-2">
          {report.recommendations.map((recommendation) => (
            <Card key={recommendation.title}>
              <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
                <CardTitle className="text-base">{recommendation.title}</CardTitle>
                <SeverityBadge severity={recommendation.priority} />
              </CardHeader>
              <CardContent className="space-y-2">
                <CardDescription>For: {recommendation.relatedLeakTitle}</CardDescription>
                <p className="text-sm font-medium">{recommendation.expectedOutcome}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {report.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="font-medium text-muted-foreground">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {variant === "standalone" ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/signup">Connect My Store</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/signup">Book A Free Audit</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );

  if (variant === "embedded") {
    return content;
  }

  return <Container className="py-16">{content}</Container>;
}
