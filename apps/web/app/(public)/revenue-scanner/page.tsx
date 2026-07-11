"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Input,
  Label,
  Lead,
} from "@revsys/ui";
import { ScanExperience } from "../../../components/scan-experience";

type ScanState = "idle" | "scanning" | "error";

interface ScanApiResponse {
  success: boolean;
  error?: string;
}

function RevenueScannerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storeUrl, setStoreUrl] = useState(() => searchParams.get("url") ?? "");
  const [state, setState] = useState<ScanState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [apiResult, setApiResult] = useState<ScanApiResponse | null>(null);

  useEffect(() => {
    if (state !== "scanning" || !animationDone || !apiResult) return;

    if (apiResult.success) {
      router.push(`/revenue-report?url=${encodeURIComponent(storeUrl)}`);
    } else {
      setError(
        apiResult.error ?? "We couldn't scan that store. Please check the URL and try again."
      );
      setState("error");
    }
  }, [state, animationDone, apiResult, router, storeUrl]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setAnimationDone(false);
    setApiResult(null);
    setState("scanning");

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeUrl }),
      });
      const data = (await response.json()) as ScanApiResponse;
      setApiResult(data);
    } catch {
      setApiResult({ success: false, error: "Something went wrong. Please try again." });
    }
  }

  return (
    <Container className="flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
      <Heading level={1}>Scan Your Shopify Store</Heading>
      <Lead className="mx-auto mt-4 max-w-xl">
        Enter your store URL and let Revsys AI uncover hidden Revenue Leaks in seconds.
      </Lead>

      <Card className="mt-10 w-full max-w-lg text-left">
        <CardHeader>
          <CardTitle>{state === "error" ? "Scan Failed" : "Analyze My Store"}</CardTitle>
          <CardDescription>
            {state === "error"
              ? "Please check your store URL and try again."
              : "We'll analyze your store's public storefront for Revenue Leaks."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state === "scanning" ? (
            <ScanExperience onComplete={() => setAnimationDone(true)} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeUrl">Store URL</Label>
                <Input
                  id="storeUrl"
                  name="storeUrl"
                  placeholder="your-store.myshopify.com"
                  value={storeUrl}
                  onChange={(event) => setStoreUrl(event.target.value)}
                  required
                />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full">
                Analyze My Store
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default function RevenueScannerPage() {
  return (
    <Suspense fallback={null}>
      <RevenueScannerForm />
    </Suspense>
  );
}
