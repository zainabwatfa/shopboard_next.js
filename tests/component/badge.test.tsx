// First component test: proves React Testing Library renders our components
// under jsdom and the jest-dom matchers are wired (vitest.setup.ts).
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("shows its content", () => {
    render(<Badge>3</Badge>);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
