import { redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { Sidebar } from "../../components/sidebar";
import { Header } from "../../components/header";
import { computeCategorySummaries, getLatestReport, getMerchantStore } from "../../lib/dashboard-data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  const user = await getCurrentUser(client);

  if (!user) {
    redirect("/login");
  }

  const store = await getMerchantStore(user.id);
  const report = store ? await getLatestReport(store) : null;
  const categorySummaries = computeCategorySummaries(report?.leaks ?? []);

  return (
    <div className="flex min-h-dvh">
      <Sidebar categories={categorySummaries} />
      <div className="flex flex-1 flex-col">
        <Header email={user.email ?? ""} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
