import Link from "next/link";
import { Button, Container, Heading, Lead } from "@revsys/ui";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <Container className="flex flex-col items-center gap-6 py-24 text-center">
      <Heading level={1}>{title}</Heading>
      <Lead className="max-w-xl">{description}</Lead>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/revenue-scanner">Find My Lost Revenue</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back To Home</Link>
        </Button>
      </div>
    </Container>
  );
}
