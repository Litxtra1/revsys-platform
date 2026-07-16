import { Button } from "@revsys/ui";
import { Plug } from "lucide-react";
import { ConnectShopifyDialog } from "./connect-shopify-dialog";

export function EmptyStateConnectStore() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald/10 text-emerald">
        <Plug className="h-6 w-6" />
      </div>
      <h2 className="mt-6 font-heading text-2xl font-semibold">Connect your Shopify store</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Connect Shopify to run your first scan and start seeing exactly where your store is
        leaking revenue.
      </p>
      <ConnectShopifyDialog trigger={<Button size="lg" className="mt-6">Connect Shopify</Button>} />
    </div>
  );
}
