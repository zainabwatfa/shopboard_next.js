// First unit test: proves Vitest runs TypeScript, resolves the "@/…" alias
// and the copied files' .ts-extension imports. The real suites build on this.
import { describe, expect, it } from "vitest";
import { formatMoney } from "@/lib/format.ts";

describe("formatMoney", () => {
  it("formats whole dollars with two decimals", () => {
    expect(formatMoney(89)).toBe("$89.00");
  });

  it("groups thousands", () => {
    expect(formatMoney(12345)).toBe("$12,345.00");
  });
});
