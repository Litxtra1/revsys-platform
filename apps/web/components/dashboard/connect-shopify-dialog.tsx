"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@revsys/ui";
import { Plug } from "lucide-react";
import { resolveShopifyDomainAction } from "../../lib/shopify-actions";

export function ConnectShopifyDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your Shopify store</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="shopify-domain">Your store's URL</Label>
          <Input
            id="shopify-domain"
            placeholder="yourstore.com"
            value={store}
            onChange={(e) => setStore(e.target.value)}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await resolveShopifyDomainAction(store);
                if ("error" in result) {
                  setError(result.error);
                  return;
                }
                window.location.href = `/auth/shopify/start?shop=${encodeURIComponent(result.shop)}`;
              });
            }}
          >
            <Plug className="h-4 w-4" />
            {isPending ? "Connecting…" : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
