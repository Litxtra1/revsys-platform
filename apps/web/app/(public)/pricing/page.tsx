"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Lead,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "@revsys/ui";

interface Tier {
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    tagline: "Find out where you're losing revenue.",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaLabel: "Get Started Free",
    ctaHref: "/signup",
    features: [
      "Public Revenue Scanner",
      "Full Revenue Report",
      "Revenue Calculator",
      "Email support",
    ],
  },
  {
    name: "Growth",
    tagline: "Turn what you find into recovered revenue.",
    monthlyPrice: 99,
    annualPrice: 990,
    ctaLabel: "Get Started",
    ctaHref: "/signup",
    featured: true,
    features: [
      "Everything in Starter",
      "Connected Shopify store analysis",
      "Ongoing revenue leak detection",
      "Guided recovery plans",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    tagline: "Grow revenue across your entire business.",
    monthlyPrice: 299,
    annualPrice: 2990,
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
    features: [
      "Everything in Growth",
      "Multiple stores",
      "Dedicated account manager",
      "Custom integrations",
    ],
  },
];

interface FeatureRow {
  label: string;
  starter: boolean;
  growth: boolean;
  scale: boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  { label: "Public Revenue Scanner", starter: true, growth: true, scale: true },
  { label: "Revenue Calculator", starter: true, growth: true, scale: true },
  { label: "Full Revenue Report", starter: true, growth: true, scale: true },
  { label: "Connected Shopify store analysis", starter: false, growth: true, scale: true },
  { label: "Ongoing revenue leak detection", starter: false, growth: true, scale: true },
  { label: "Guided recovery plans", starter: false, growth: true, scale: true },
  { label: "Priority support", starter: false, growth: true, scale: true },
  { label: "Multiple stores", starter: false, growth: false, scale: true },
  { label: "Dedicated account manager", starter: false, growth: false, scale: true },
];

interface Faq {
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. You can move between plans as your store grows — there's no long-term commitment required.",
  },
  {
    question: "Is there a free option?",
    answer:
      "Yes. The Revenue Scanner and Revenue Calculator are free to use and don't require an account.",
  },
  {
    question: "What's different about the Scale plan?",
    answer:
      "Our team works with you directly to set up tracking across multiple stores and connect custom integrations.",
  },
  {
    question: "Do you offer a discount for annual billing?",
    answer: "Yes. Paying annually saves roughly 17% compared to paying month to month.",
  },
];

function formatPrice(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <Container className="space-y-16 py-16">
      <div className="text-center">
        <Heading level={1}>Pricing That Grows With Your Revenue</Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          Start free. Upgrade when you&apos;re ready to turn what we find into revenue you
          recover.
        </Lead>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm",
              !isAnnual ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            aria-label="Toggle annual billing"
          />
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              isAnnual ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            Annual
            <Badge variant="success">Save 17%</Badge>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const isFree = tier.monthlyPrice === 0;
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
          const monthlyEquivalent = (tier.annualPrice / 12).toFixed(2);
          return (
            <Card
              key={tier.name}
              className={cn(tier.featured && "border-primary shadow-soft-lg")}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{tier.name}</CardTitle>
                  {tier.featured ? <Badge>Most Popular</Badge> : null}
                </div>
                <CardDescription>{tier.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-6">
                <div>
                  {isFree ? (
                    <span className="text-4xl font-semibold text-foreground">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold text-foreground">
                        {formatPrice(price)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isAnnual ? "/year" : "/mo"}
                      </span>
                    </>
                  )}
                  {!isFree && isAnnual ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Billed annually — ${monthlyEquivalent}/mo equivalent
                    </p>
                  ) : null}
                  {isFree ? (
                    <p className="mt-1 text-xs text-muted-foreground">No credit card required</p>
                  ) : null}
                </div>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={tier.featured ? "default" : "outline"}
                >
                  <Link href={tier.ctaHref}>{tier.ctaLabel}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <section className="space-y-6">
        <Heading level={2} className="text-center">
          Compare Plans
        </Heading>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Starter</TableHead>
                <TableHead className="text-center">Growth</TableHead>
                <TableHead className="text-center">Scale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FEATURE_ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell className="text-center">
                    {row.starter ? (
                      <Check className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.growth ? (
                      <Check className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.scale ? (
                      <Check className="mx-auto h-4 w-4 text-success" aria-hidden="true" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="space-y-6">
        <Heading level={2} className="text-center">
          Frequently Asked Questions
        </Heading>
        <Accordion type="single" collapsible className="mx-auto max-w-2xl">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/revenue-scanner">Start Your Free Scan</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/demo">See A Demo</Link>
        </Button>
      </div>
    </Container>
  );
}
