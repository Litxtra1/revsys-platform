import { Container, Heading, Text } from "@revsys/ui";

const EXAMPLE_CATEGORIES = [
  "Checkout Friction",
  "Trust Gaps",
  "Mobile Experience",
  "Product Messaging",
];

export function RevenueLeakIntro() {
  return (
    <section className="border-t border-border py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading level={2}>What Is A Revenue Leak?</Heading>
          <Text className="mt-4">
            A Revenue Leak is any point in your customer journey where revenue is quietly lost — not
            because your product is wrong, but because something in the experience is preventing a
            visitor from becoming a customer.
          </Text>
          <Text className="mt-4">
            Most Revenue Leaks are invisible. They don&apos;t show up as an error message or a
            broken page. They show up as a slightly lower conversion rate, a slightly higher bounce
            rate, a slightly smaller average order — spread across thousands of visits.
          </Text>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {EXAMPLE_CATEGORIES.map((item) => (
            <div key={item} className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm font-medium">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
