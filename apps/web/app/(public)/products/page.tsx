import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Lead,
  Muted,
} from "@revsys/ui";

interface Product {
  name: string;
  status?: "Coming Soon";
  problem: string;
  solution: string;
  businessOutcome: string;
  merchantBenefit: string;
  cta?: { label: string; href: string };
}

const PRODUCTS: Product[] = [
  {
    name: "Revenue Scanner",
    problem:
      "Most merchants have no visibility into why their store underperforms — they see the symptoms, not the causes.",
    solution:
      "Revsys AI scans your storefront and benchmarks it against proven revenue signals to surface exactly where revenue is leaking.",
    businessOutcome: "A clear, evidence-based diagnosis of your store's Revenue Health in minutes.",
    merchantBenefit: "Know exactly where to focus before investing another dollar in traffic.",
    cta: { label: "Scan My Store", href: "/revenue-scanner" },
  },
  {
    name: "Revenue Diagnosis",
    problem:
      "Analytics tools report metrics. Almost none explain why those metrics are happening or what to do about them.",
    solution:
      "Revsys AI translates raw signals into prioritized, evidence-backed Revenue Leaks with estimated business impact and confidence scores.",
    businessOutcome: "A prioritized list of what to fix first, ranked by real revenue impact.",
    merchantBenefit: "Stop guessing — every recommendation comes with the evidence behind it.",
  },
  {
    name: "Revenue Recovery",
    problem:
      "Even when problems are identified, most merchants don't know how to turn a diagnosis into a completed fix.",
    solution:
      "Revsys AI builds actionable Recovery Plans that break each Revenue Leak into trackable tasks with expected impact.",
    businessOutcome:
      "A clear path from insight to recovered revenue, with progress you can measure.",
    merchantBenefit: "See exactly why each leak is happening, not just another report.",
  },
  {
    name: "Adaptive Shopping",
    status: "Coming Soon",
    problem:
      "Every visitor sees the same storefront, regardless of what would actually convert them.",
    solution:
      "Revsys AI will adapt storefront experiences in real time based on visitor intent and behavior.",
    businessOutcome: "Higher conversion rates without manual A/B testing overhead.",
    merchantBenefit: "A storefront that continuously optimizes itself for revenue.",
  },
  {
    name: "Demand Capture",
    status: "Coming Soon",
    problem:
      "Merchants lose visitors who show buying intent but leave before converting, with no way to bring them back.",
    solution:
      "Revsys AI will identify and act on high-intent demand signals across the customer journey.",
    businessOutcome: "Fewer missed opportunities from visitors who were ready to buy.",
    merchantBenefit: "Capture demand you're currently losing, automatically.",
  },
];

export default function ProductsPage() {
  return (
    <Container className="space-y-12 py-16">
      <div className="text-center">
        <Heading level={1}>Revenue Solutions</Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          Every Revsys AI product exists to answer one question: how does this help you discover,
          understand, or recover Revenue Leaks?
        </Lead>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PRODUCTS.map((product) => (
          <Card key={product.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{product.name}</CardTitle>
                {product.status ? <Badge variant="secondary">{product.status}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <div>
                <Muted className="font-medium text-foreground">Problem</Muted>
                <CardDescription>{product.problem}</CardDescription>
              </div>
              <div>
                <Muted className="font-medium text-foreground">Solution</Muted>
                <CardDescription>{product.solution}</CardDescription>
              </div>
              <div>
                <Muted className="font-medium text-foreground">Business Outcome</Muted>
                <CardDescription>{product.businessOutcome}</CardDescription>
              </div>
              <div>
                <Muted className="font-medium text-foreground">Expected Merchant Benefit</Muted>
                <CardDescription>{product.merchantBenefit}</CardDescription>
              </div>
              {product.cta ? (
                <Button asChild className="mt-auto w-full">
                  <Link href={product.cta.href}>{product.cta.label}</Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
