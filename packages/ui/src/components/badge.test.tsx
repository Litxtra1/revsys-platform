import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Critical</Badge>);
    expect(screen.getByText("Critical")).toBeInTheDocument();
  });

  it("applies the default variant classes", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("applies the success variant classes", () => {
    render(<Badge variant="success">Recovered</Badge>);
    expect(screen.getByText("Recovered")).toHaveClass("bg-success", "text-success-foreground");
  });

  it("merges a custom className with variant classes", () => {
    render(
      <Badge variant="outline" className="ml-2">
        Outline
      </Badge>
    );
    expect(screen.getByText("Outline")).toHaveClass("border-border", "ml-2");
  });
});
