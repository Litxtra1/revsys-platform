"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Card, CardContent, Container, Heading, Input, Lead } from "@revsys/ui";

export function ScannerCta() {
  const router = useRouter();
  const [storeUrl, setStoreUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/revenue-scanner?url=${encodeURIComponent(storeUrl)}`);
  }

  return (
    <section className="py-20">
      <Container className="text-center">
        <Heading level={2}>See What Your Store Is Missing</Heading>
        <Lead className="mx-auto mt-3 max-w-xl">
          Enter your Shopify store URL for a free, instant Revenue Leak scan.
        </Lead>
        <Card className="mx-auto mt-8 max-w-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                aria-label="Store URL"
                placeholder="your-store.myshopify.com"
                value={storeUrl}
                onChange={(event) => setStoreUrl(event.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit">Analyze My Store</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
