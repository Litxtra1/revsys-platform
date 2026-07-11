import * as React from "react";
import { cn } from "../lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

const headingTags: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

const headingStyles: Record<HeadingLevel, string> = {
  1: "font-heading text-4xl font-semibold tracking-tight",
  2: "font-heading text-3xl font-semibold tracking-tight",
  3: "font-heading text-2xl font-semibold tracking-tight",
  4: "font-heading text-xl font-semibold tracking-tight",
};

export function Heading({ level = 1, className, ...props }: HeadingProps) {
  const Tag = headingTags[level];
  return <Tag className={cn(headingStyles[level], className)} {...props} />;
}

export function Text({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-base leading-7", className)} {...props} />;
}

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-lg text-muted-foreground", className)} {...props} />;
}

export function Muted({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function Small({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <small className={cn("text-sm font-medium leading-none", className)} {...props} />;
}
