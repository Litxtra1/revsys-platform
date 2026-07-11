import { createRevenueIntelligenceCore } from "@revsys/engines";

// Module-scoped singleton — registration is cheap/idempotent and this
// mirrors how a long-lived coordinator would be instantiated once per
// server process.
export const revenueIntelligenceCore = createRevenueIntelligenceCore();
