import { Hero } from "../../components/home/hero";
import { TrustStats } from "../../components/home/trust-stats";
import { ScannerCta } from "../../components/home/scanner-cta";
import { RevenueLeakIntro } from "../../components/home/revenue-leak-intro";
import { WhyLeaksMatter } from "../../components/home/why-leaks-matter";
import { ProductOverview } from "../../components/home/product-overview";
import { ProductDemonstrations } from "../../components/home/product-demonstrations";
import { CaseStudies } from "../../components/home/case-studies";
import { CalculatorCta } from "../../components/home/calculator-cta";
import { HowItWorks } from "../../components/home/how-it-works";
import { TrustedByShopify } from "../../components/home/trusted-by-shopify";
import { Testimonials } from "../../components/home/testimonials";
import { Faq } from "../../components/home/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <ScannerCta />
      <RevenueLeakIntro />
      <WhyLeaksMatter />
      <ProductOverview />
      <ProductDemonstrations />
      <CaseStudies />
      <CalculatorCta />
      <HowItWorks />
      <TrustedByShopify />
      <Testimonials />
      <Faq />
    </>
  );
}
