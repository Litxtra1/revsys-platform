"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthShell } from "../../../components/marketing/auth-shell";
import { signInAction } from "../../../lib/auth-actions";

export const SIGNUP_NOTICE_KEY = "revsys-just-signed-up";

export function LoginPageClient({ shopifyError }: { shopifyError: string | null }) {
  const [notice, setNotice] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (sessionStorage.getItem(SIGNUP_NOTICE_KEY)) {
      sessionStorage.removeItem(SIGNUP_NOTICE_KEY);
      setNotice("Account created — check your email to confirm it, then sign in.");
    }
  }, []);

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Welcome back."
      lede="Open your latest Revenue Report and pick up where your revenue left off."
      submitLabel="Sign in"
      notice={notice}
      initialError={shopifyError}
      onSubmit={({ email, password }) => signInAction(email, password)}
      footer={
        <>
          New to Revsys?{" "}
          <Link href="/signup" className="font-medium text-revenue hover:brightness-110">
            Create your Mission Control →
          </Link>
        </>
      }
    />
  );
}
