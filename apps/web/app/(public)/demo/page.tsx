import { Container, Heading, Lead, Tabs, TabsContent, TabsList, TabsTrigger } from "@revsys/ui";
import { AdaptiveShoppingDemo } from "../../../components/demo/adaptive-shopping-demo";
import { DemandCaptureDemo } from "../../../components/demo/demand-capture-demo";
import { RevenueRecoveryDemo } from "../../../components/demo/revenue-recovery-demo";

export default function DemoPage() {
  return (
    <Container className="space-y-10 py-16">
      <div className="text-center">
        <Heading level={1}>See Revsys AI In Practice</Heading>
        <Lead className="mx-auto mt-4 max-w-2xl">
          A closer look at how personalized experiences, smarter demand generation, and guided
          recovery plans work together to grow revenue.
        </Lead>
      </div>

      <Tabs defaultValue="adaptive-shopping">
        <TabsList className="mx-auto flex w-fit flex-wrap justify-center">
          <TabsTrigger value="adaptive-shopping">Adaptive Shopping</TabsTrigger>
          <TabsTrigger value="demand-capture">Demand Capture</TabsTrigger>
          <TabsTrigger value="revenue-recovery">Revenue Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="adaptive-shopping">
          <AdaptiveShoppingDemo />
        </TabsContent>
        <TabsContent value="demand-capture">
          <DemandCaptureDemo />
        </TabsContent>
        <TabsContent value="revenue-recovery">
          <RevenueRecoveryDemo />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
