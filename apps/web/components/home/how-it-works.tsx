import { Container, Heading, Lead } from "@revsys/ui";

const STEPS = [
  { title: "Discover", description: "Scan your store to surface hidden Revenue Leaks." },
  {
    title: "Diagnose",
    description: "Understand why each Revenue Leak is happening, with evidence.",
  },
  {
    title: "Connect",
    description: "Connect your Shopify store to unlock a deeper, store-specific Revenue Report.",
  },
  { title: "Recover", description: "Follow a prioritized Recovery Plan to fix what matters most." },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border py-20">
      <Container>
        <div className="text-center">
          <Heading level={2}>How Revsys AI Works</Heading>
          <Lead className="mx-auto mt-3 max-w-2xl">
            A simple path from hidden revenue to recovered revenue.
          </Lead>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-xl border border-border bg-card p-6">
              <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
              <p className="mt-2 text-lg font-semibold">{step.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
