"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "../../../components/marketing/auth-shell";
import { signUpAction } from "../../../lib/auth-actions";
import { SIGNUP_NOTICE_KEY } from "../login/login-page-client";

export function SignupPageClient() {
  const router = useRouter();

  return (
    <AuthShell
      eyebrow="Get started"
      title="Find your first leak in 90 seconds."
      lede="Create your Mission Control. Connect Shopify. Get a consulting-grade Revenue Report — free."
      submitLabel="Create my Mission Control"
      onSubmit={async ({ email, password }) => {
        const result = await signUpAction(email, password);
        if (!result.error) {
          sessionStorage.setItem(SIGNUP_NOTICE_KEY, "1");
          router.push("/login");
        }
        return result;
      }}
      footer={
        <>
          Already using Revsys?{" "}
          <Link href="/login" className="font-medium text-revenue hover:brightness-110">
            Sign in →
          </Link>
        </>
      }
    />
  );
}
