// Runs before every test file (see vitest.config.ts setupFiles):
// - jest-dom adds matchers like toBeInTheDocument / toHaveAccessibleName
// - cleanup unmounts what a test rendered, so tests can't leak into each other
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
