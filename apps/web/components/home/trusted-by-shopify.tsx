import { Container, Muted } from "@revsys/ui";

export function TrustedByShopify() {
  return (
    <section className="border-t border-border bg-card/50 py-16">
      <Container className="text-center">
        <Muted>Built For Shopify Merchants</Muted>
        <p className="mt-4 text-2xl font-semibold text-muted-foreground">Shopify</p>
      </Container>
    </section>
  );
}
