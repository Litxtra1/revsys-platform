import { Card, CardContent, Container, Heading } from "@revsys/ui";

const TESTIMONIALS = [
  {
    quote:
      "We had no idea our checkout flow was costing us this much every month until we saw the report.",
    name: "Store Owner",
    company: "Illustrative Merchant",
  },
  {
    quote: "The prioritization was the most useful part — we finally knew what to fix first.",
    name: "Store Owner",
    company: "Illustrative Merchant",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border py-20">
      <Container>
        <Heading level={2} className="text-center">
          What Merchants Are Saying
        </Heading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.quote}>
              <CardContent className="p-6">
                <p className="text-sm italic text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.company}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
