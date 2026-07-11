import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Lead,
} from "@revsys/ui";

export function ProductDemonstrations() {
  return (
    <section className="border-t border-border bg-card/50 py-20">
      <Container className="text-center">
        <Heading level={2}>See How Revsys AI Grows Your Store</Heading>
        <Lead className="mx-auto mt-3 max-w-2xl">
          Explore how personalized shopping experiences, smarter demand generation, and guided
          recovery plans work together — no store connection required.
        </Lead>
        <Card className="mx-auto mt-10 max-w-2xl text-left">
          <CardHeader>
            <CardTitle>Interactive Product Walkthrough</CardTitle>
            <CardDescription>
              See real before-and-after business scenarios across Adaptive Shopping, Demand
              Capture, and Revenue Recovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/demo">Explore The Walkthrough</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
