import Link from "next/link";
import { Button, Container, Heading, Lead } from "@revsys/ui";

export function Hero() {
  return (
    <section className="border-b border-border bg-card/50">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <Heading level={1} className="max-w-3xl text-5xl sm:text-6xl">
          Your Shopify Store Is Probably Losing Revenue Right Now
        </Heading>
        <Lead className="max-w-2xl">
          Revsys AI shows you exactly where, why, and how much — in minutes, without connecting
          anything.
        </Lead>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/revenue-scanner">Find My Lost Revenue</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/demo">Watch The Demo</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
