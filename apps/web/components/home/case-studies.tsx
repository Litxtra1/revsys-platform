import { Card, CardContent, CardHeader, CardTitle, Container, Heading, Lead, Muted } from "@revsys/ui";

interface CaseStudy {
  businessType: string;
  challenge: string;
  leakDetected: string;
  howIdentified: string;
  recommendedAction: string;
  outcome: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    businessType: "Home & Living Retailer",
    challenge: "Steady traffic, but conversion had been flat for months.",
    leakDetected: "Checkout required five steps with no guest checkout option.",
    howIdentified: "The scan flagged checkout friction based on step count and missing guest checkout.",
    recommendedAction: "Cut checkout to two steps and add guest checkout.",
    outcome: "Projected to recover a meaningful share of abandoned checkouts each month.",
  },
  {
    businessType: "Outdoor & Apparel Brand",
    challenge: "Most traffic came from mobile, but sales didn't reflect it.",
    leakDetected: "Mobile pages loaded slowly and had undersized tap targets.",
    howIdentified: "The scan compared mobile and desktop signals and found a clear gap.",
    recommendedAction: "Compress mobile assets and resize tap targets.",
    outcome: "Expected to close a large share of the mobile conversion gap.",
  },
  {
    businessType: "Food & Beverage Brand",
    challenge: "New visitors rarely became repeat customers.",
    leakDetected: "Product pages lacked reviews and visible trust signals.",
    howIdentified: "The scan found social proof well below the category benchmark.",
    recommendedAction: "Add reviews and trust badges to key product pages.",
    outcome: "Positioned to build buyer confidence ahead of a seasonal push.",
  },
];

export function CaseStudies() {
  return (
    <section className="border-t border-border py-20">
      <Container>
        <div className="text-center">
          <Heading level={2}>Real Scenarios, Real Decisions</Heading>
          <Lead className="mx-auto mt-3 max-w-2xl">
            Illustrative examples of how a scan turns into a plan.
          </Lead>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <Card key={study.businessType}>
              <CardHeader>
                <CardTitle className="text-base">{study.businessType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Muted className="font-medium text-foreground">Challenge</Muted>
                  <p className="text-sm text-muted-foreground">{study.challenge}</p>
                </div>
                <div>
                  <Muted className="font-medium text-foreground">Revenue Leak Detected</Muted>
                  <p className="text-sm text-muted-foreground">{study.leakDetected}</p>
                </div>
                <div>
                  <Muted className="font-medium text-foreground">How It Was Found</Muted>
                  <p className="text-sm text-muted-foreground">{study.howIdentified}</p>
                </div>
                <div>
                  <Muted className="font-medium text-foreground">Recommended Action</Muted>
                  <p className="text-sm text-muted-foreground">{study.recommendedAction}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <Muted className="font-medium text-foreground">Outcome</Muted>
                  <p className="text-sm text-muted-foreground">{study.outcome}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
