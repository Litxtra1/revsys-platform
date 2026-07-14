import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Heading, Lead } from "@revsys/ui";
import { RecoveryQueueTable } from "../../../../components/dashboard/recovery-queue-table";
import { getLatestReport, getMerchantStore } from "../../../../lib/dashboard-data";

export default async function RevenueFixesPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>Revenue Recovery Queue</Heading>
        <Lead className="mt-1 text-base">
          Every revenue leak across your store, prioritized by impact.
        </Lead>
      </div>
      <RecoveryQueueTable leaks={report?.leaks ?? []} />
    </div>
  );
}
