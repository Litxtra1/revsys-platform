import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Badge, Card, CardContent, Heading, Lead } from "@revsys/ui";
import { EmptyStateConnectStore } from "../../../../components/dashboard/empty-state-connect-store";
import { getMerchantStore, getScanHistory } from "../../../../lib/dashboard-data";
import { formatRelativeTime, formatUsd } from "../../../../lib/format";

function statusVariant(status: string): "success" | "warning" | "secondary" {
  if (status === "completed") return "success";
  if (status === "failed") return "warning";
  return "secondary";
}

export default async function AiInsightsPage() {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  const user = await getCurrentUser(client);
  if (!user) redirect("/login");

  const store = await getMerchantStore(user.id);
  if (!store) return <EmptyStateConnectStore />;

  const history = await getScanHistory(store.id);

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Scan History</Heading>
        <Lead className="mt-1 text-base">
          How your revenue opportunity has changed across every scan of {store.name}.
        </Lead>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No scans yet. Run your first scan from the Overview page to start tracking progress.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((scan) => (
            <Card key={scan.id}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="font-medium">{formatRelativeTime(scan.startedAt)}</div>
                  <div className="text-sm text-muted-foreground">
                    {scan.confidence != null ? `${scan.confidence}% confidence` : "Confidence pending"}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-heading text-lg font-semibold tabular-nums text-emerald">
                      {scan.monthlyOpportunity != null ? formatUsd(scan.monthlyOpportunity) : "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">monthly opportunity</div>
                  </div>
                  <Badge variant={statusVariant(scan.status)}>{scan.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
