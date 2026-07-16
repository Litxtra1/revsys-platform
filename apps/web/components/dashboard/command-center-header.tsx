import { Button, cn } from "@revsys/ui";
import { Download, Plug, Share2 } from "lucide-react";
import { formatRelativeTime } from "../../lib/format";
import { ConnectShopifyDialog } from "./connect-shopify-dialog";
import { RunScanButton } from "./run-scan-button";

export function CommandCenterHeader({
  storeName,
  lastScanAt,
  scanStatus,
  shopifyConnected,
}: {
  storeName: string;
  lastScanAt: string;
  scanStatus: string;
  shopifyConnected: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-heading text-2xl font-semibold">{storeName}</div>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              scanStatus === "completed" ? "bg-emerald" : "bg-warning"
            )}
          />
          Last scan {formatRelativeTime(lastScanAt)}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <RunScanButton />
        {!shopifyConnected ? (
          <ConnectShopifyDialog
            trigger={
              <Button variant="outline">
                <Plug className="h-4 w-4" /> Connect Shopify
              </Button>
            }
          />
        ) : null}
        <Button variant="outline">
          <Download className="h-4 w-4" /> Download Report
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4" /> Share Report
        </Button>
      </div>
    </div>
  );
}
