import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Container,
  Heading,
} from "@revsys/ui";

const FAQS = [
  {
    question: "Do I need to connect my Shopify store to get a Revenue Report?",
    answer:
      "No. The public Revenue Scanner works with just your store's URL. Connecting Shopify unlocks a deeper, store-specific Revenue Report.",
  },
  {
    question: "Is my data safe?",
    answer:
      "The public scan only analyzes publicly available storefront information. We never ask for account credentials as part of a public scan.",
  },
  {
    question: "How accurate is the Revenue Report?",
    answer:
      "Public scans provide a benchmark-based estimate. Confidence increases significantly once your Shopify store is connected.",
  },
  {
    question: "What happens after I connect my store?",
    answer:
      "Revsys AI runs a deeper analysis of your store and prioritizes the Revenue Leaks that matter most to your business.",
  },
  {
    question: "Is Revsys AI a replacement for my existing tools?",
    answer:
      "No. Revsys AI sits above your existing ecommerce stack and tells you where to focus your attention first.",
  },
];

export function Faq() {
  return (
    <section className="border-t border-border py-20">
      <Container className="max-w-3xl">
        <Heading level={2} className="text-center">
          Frequently Asked Questions
        </Heading>
        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
