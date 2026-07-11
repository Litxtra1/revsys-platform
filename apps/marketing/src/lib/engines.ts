import { createRevenueIntelligenceCore } from "@revsys/engines";

// Module-scoped singleton, mirroring apps/web/lib/engines.ts — registration
// is cheap/idempotent and this is a long-lived coordinator instantiated once
// per server process.
export const revenueIntelligenceCore = createRevenueIntelligenceCore();
