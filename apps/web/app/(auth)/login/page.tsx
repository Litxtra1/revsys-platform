"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@revsys/ui";
import { signInAction, type AuthActionState } from "../actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in to Revsys AI</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Logging in..." : "Log in"}
          </Button>
          <div className="flex justify-between text-sm text-muted-foreground">
            <Link href="/signup" className="underline">
              Create an account
            </Link>
            <Link href="/reset-password" className="underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
