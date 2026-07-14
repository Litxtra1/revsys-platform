import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Badge, Card, CardContent, Heading, Lead } from "@revsys/ui";
import { Store } from "lucide-react";
import { EmptyStateConnectStore } from "../../../../components/dashboard/empty-state-connect-store";
import { getMerchantStore, getStoreIntegrations } from "../../../../lib/dashboard-data";
import { formatRelativeTime } from "../../../../lib/format";

function statusVariant(status: string): "success" | "warning" | "secondary" {
  if (status === "active" || status === "connected") return "success";
  if (status === "error" || status === "expired") return "warning";
  return "secondary";
}

export default async function IntegrationsPage() {
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

  const integrations = await getStoreIntegrations(store.id);

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Integrations</Heading>
        <Lead className="mt-1 text-base">Stores and services connected to {store.name}.</Lead>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald/10 text-emerald">
              <Store className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium">{store.name}</div>
              <div className="text-sm text-muted-foreground">{store.domain}</div>
            </div>
          </div>
          <Badge variant={store.shopifyConnected ? "success" : "secondary"}>
            {store.shopifyConnected ? "Connected" : "Not connected"}
          </Badge>
        </CardContent>
      </Card>

      {integrations.length > 0 && (
        <div className="space-y-3">
          {integrations.map((integration) => (
            <Card key={integration.provider}>
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <div className="font-medium capitalize">{integration.provider}</div>
                  <div className="text-sm text-muted-foreground">
                    {integration.connectedAt
                      ? `Connected ${formatRelativeTime(integration.connectedAt)}`
                      : "Not yet connected"}
                  </div>
                </div>
                <Badge variant={statusVariant(integration.status)}>{integration.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
