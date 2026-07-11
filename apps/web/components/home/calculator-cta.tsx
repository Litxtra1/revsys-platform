import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
} from "@revsys/ui";

export function CalculatorCta() {
  return (
    <section className="border-t border-border bg-card/50 py-20">
      <Container>
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle>How Much Revenue Are You Leaving On The Table?</CardTitle>
            <CardDescription>
              Use the Revenue Calculator to estimate your store&apos;s revenue opportunity based on
              your own traffic and conversion numbers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/calculator">Open Revenue Calculator</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
