import { UserMenu } from "./user-menu";
import { ThemeToggle } from "./theme-toggle";

export function Header({ email }: { email: string }) {
  return (
    <header className="flex h-16 items-center justify-end gap-2 border-b border-border px-6">
      <ThemeToggle />
      <UserMenu email={email} />
    </header>
  );
}
