// Component tests for QuantityStepper (− 2 +), the cart row's control.
// Testing Library queries the way a user (or screen reader) finds things:
// by role and accessible name — so the aria-labels and the hidden
// "Quantity" text are verified by the queries themselves.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantityStepper } from "@/features/cart/components/QuantityStepper";

describe("QuantityStepper", () => {
  it("shows the quantity, with the hidden 'Quantity' word for screen readers", () => {
    render(
      <QuantityStepper
        name="Leather Tote Bag"
        qty={2}
        onDecrease={vi.fn()}
        onIncrease={vi.fn()}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    // Real text, visually hidden — screen readers hear "Quantity 2"
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("+ calls onIncrease (and only it), named after the product", async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();
    render(
      <QuantityStepper
        name="Leather Tote Bag"
        qty={1}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Increase quantity of Leather Tote Bag",
      }),
    );

    expect(onIncrease).toHaveBeenCalledTimes(1);
    expect(onDecrease).not.toHaveBeenCalled();
  });

  it("− calls onDecrease (and only it), named after the product", async () => {
    const user = userEvent.setup();
    const onIncrease = vi.fn();
    const onDecrease = vi.fn();
    render(
      <QuantityStepper
        name="Leather Tote Bag"
        qty={1}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrease quantity of Leather Tote Bag",
      }),
    );

    expect(onDecrease).toHaveBeenCalledTimes(1);
    expect(onIncrease).not.toHaveBeenCalled();
  });
});
