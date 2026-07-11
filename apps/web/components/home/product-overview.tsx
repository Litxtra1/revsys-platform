import Link from "next/link";
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Lead,
} from "@revsys/ui";

const PRODUCTS = [
  {
    name: "Revenue Scanner",
    description: "Scan any Shopify store and find where revenue is slipping away.",
  },
  {
    name: "Revenue Diagnosis",
    description: "See exactly why each leak is happening, backed by evidence.",
  },
  {
    name: "Revenue Recovery",
    description: "Turn every finding into a plan you can act on this week.",
  },
];

export function ProductOverview() {
  return (
    <section className="border-t border-border py-20">
      <Container>
        <div className="text-center">
          <Heading level={2}>Everything You Need To Stop Losing Revenue</Heading>
          <Lead className="mx-auto mt-3 max-w-2xl">
            One platform to find leaks, understand them, and fix them — in that order.
          </Lead>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => (
            <Card key={product.name}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/products">Explore All Products</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
