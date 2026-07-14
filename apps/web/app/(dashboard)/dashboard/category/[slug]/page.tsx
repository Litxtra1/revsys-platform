import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { REVENUE_CATEGORIES } from "@revsys/engines";
import { Heading, Lead } from "@revsys/ui";
import { LeakCard } from "../../../../../components/dashboard/leak-card";
import { getLatestReport, getMerchantStore } from "../../../../../lib/dashboard-data";
import { formatUsd } from "../../../../../lib/format";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryWorkspacePage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);

  if (!(REVENUE_CATEGORIES as readonly string[]).includes(category)) {
    notFound();
  }

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
  const categoryLeaks = (report?.leaks ?? []).filter((leak) => leak.category === category);
  const monthlyImpact = categoryLeaks.reduce(
    (sum, leak) => sum + (leak.estimatedImpactLow + leak.estimatedImpactHigh) / 2,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <Heading level={2}>{category}</Heading>
        <Lead className="mt-1 text-base">
          {categoryLeaks.length > 0
            ? `${categoryLeaks.length} ${categoryLeaks.length === 1 ? "issue" : "issues"} found · ${formatUsd(monthlyImpact)}/mo estimated impact`
            : "No issues detected in this category on your latest scan."}
        </Lead>
      </div>

      <div className="space-y-4">
        {categoryLeaks.map((leak) => (
          <LeakCard key={leak.id} leak={leak} />
        ))}
      </div>
    </div>
  );
}
