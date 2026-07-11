import { NextResponse, type NextRequest } from "next/server";
import { storeUrlSchema } from "@revsys/shared";
import { revenueIntelligenceCore } from "../../../lib/engines";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { storeUrl?: unknown } | null;
  const rawStoreUrl = typeof body?.storeUrl === "string" ? body.storeUrl : "";

  const validation = storeUrlSchema.safeParse(rawStoreUrl);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error.issues[0]?.message ?? "Invalid store URL." },
      { status: 400 }
    );
  }

  const result = await revenueIntelligenceCore.dispatch(
    "RevenueScannerEngine",
    { storeUrl: validation.data },
    {}
  );

  if (result.status !== "success") {
    return NextResponse.json(
      { success: false, error: result.message ?? "We couldn't scan that store." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, storeUrl: validation.data });
}
