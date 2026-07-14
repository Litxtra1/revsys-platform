import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Heading, Lead } from "@revsys/ui";
import { getLatestReport, getMerchantStore } from "../../../../lib/dashboard-data";

function toneFor(score: number): string {
  if (score >= 75) return "bg-emerald";
  if (score >= 50) return "bg-warning";
  return "bg-coral";
}

export default async function RevenueHealthPage() {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  const user = await getCurrentUser(client);
  if (!user) redirect("/login");

  const store = await getMerchantStore(user.id);
  if (!store) redirect("/dashboard");

  const report = await getLatestReport(store);
  const categoryScores = report?.categoryScores ?? {};

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Revenue Health</Heading>
        <Lead className="mt-1 text-base">
          {report ? `Overall score: ${report.overallHealthScore}/100` : "Run a scan to see your health score."}
        </Lead>
      </div>

      <div className="space-y-4">
        {Object.entries(categoryScores).map(([category, score]) => (
          <div key={category}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{category}</span>
              <span className="tabular-nums text-muted-foreground">{score}/100</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className={`h-full rounded-full ${toneFor(score)}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
