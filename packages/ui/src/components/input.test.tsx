import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with the given type and placeholder", () => {
    render(<Input type="email" placeholder="you@example.com" />);
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });

  it("calls onChange as the user types", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} aria-label="Email" />);
    await userEvent.type(screen.getByLabelText("Email"), "hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("respects the disabled attribute", () => {
    render(<Input disabled aria-label="Email" />);
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });
});
