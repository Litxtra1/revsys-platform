import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/revsys/shared";
import { AuthShell } from "./login";
import { signUpFn } from "../lib/auth.server";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Get started — Revsys AI" },
      {
        name: "description",
        content:
          "Create your Revsys Mission Control and get your first Revenue Report in 90 seconds. Free — no credit card, no install.",
      },
      { property: "og:title", content: "Get started — Revsys AI" },
      {
        property: "og:description",
        content:
          "Connect your Shopify store and see exactly where your revenue is leaking. Free.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <PageShell>
      <AuthShell
        eyebrow="Get started"
        title="Find your first leak in 90 seconds."
        lede="Create your Mission Control. Connect Shopify. Get a consulting-grade Revenue Report — free."
        submitLabel="Create my Mission Control"
        showStore
        onSubmit={async ({ email, password }) => {
          const result = await signUpFn({ data: { email, password } });
          if (result.redirectUrl) {
            window.location.assign(result.redirectUrl);
            return {};
          }
          return { error: result.error };
        }}
        footer={
          <>
            Already using Revsys?{" "}
            <Link to="/login" className="font-medium text-revenue hover:brightness-110">
              Sign in →
            </Link>
          </>
        }
      />
    </PageShell>
  );
}
