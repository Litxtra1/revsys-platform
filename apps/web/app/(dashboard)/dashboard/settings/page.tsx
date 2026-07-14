import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Card, CardContent, Heading, Lead } from "@revsys/ui";
import { getMerchantStore } from "../../../../lib/dashboard-data";

export default async function SettingsPage() {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  const user = await getCurrentUser(client);
  if (!user) redirect("/login");

  const store = await getMerchantStore(user.id);

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Settings</Heading>
        <Lead className="mt-1 text-base">Your account and store details.</Lead>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Account email
            </div>
            <div className="mt-1 font-medium">{user.email}</div>
          </div>
          {store && (
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Connected store
              </div>
              <div className="mt-1 font-medium">{store.name}</div>
              <div className="text-sm text-muted-foreground">{store.domain}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
