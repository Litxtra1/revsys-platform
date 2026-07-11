import { Heading, Text } from "@revsys/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <Heading level={2}>Overview</Heading>
      <Text className="text-muted-foreground">
        Revenue Intelligence dashboard — coming in Sprint 1.
      </Text>
    </div>
  );
}
