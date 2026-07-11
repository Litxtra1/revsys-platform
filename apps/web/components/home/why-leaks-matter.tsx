import { Container, Heading, Lead } from "@revsys/ui";

const POINTS = [
  { value: "Invisible", label: "Most Revenue Leaks don't show up in your analytics dashboard." },
  {
    value: "Compounding",
    label: "Small leaks across thousands of visits add up to real lost revenue.",
  },
  {
    value: "Fixable",
    label: "Once identified, most Revenue Leaks can be addressed without new ad spend.",
  },
];

export function WhyLeaksMatter() {
  return (
    <section className="border-t border-border bg-card/50 py-20">
      <Container className="text-center">
        <Heading level={2}>Why Revenue Leaks Matter</Heading>
        <Lead className="mx-auto mt-3 max-w-2xl">
          Every dollar lost to a Revenue Leak is a dollar you already paid to acquire — through ads,
          SEO, or word of mouth.
        </Lead>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {POINTS.map((point) => (
            <div key={point.label}>
              <p className="text-3xl font-semibold">{point.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{point.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
