"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getThemeChoice, saveThemeChoice } from "../theme.state.ts";
import type { ThemeChoice } from "../theme.types.ts";

// The theme choice lives outside React (theme.state.ts + localStorage), so
// it is read with useSyncExternalStore, like the cart.

const listeners = new Set<() => void>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

// A theme picked in another tab ("storage"), or Back/Forward showing this
// page from the browser's cache ("pageshow" with persisted)
function handleStorage(): void {
  emitChange();
}

function handlePageShow(event: PageTransitionEvent): void {
  if (event.persisted) {
    emitChange();
  }
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener("storage", handleStorage);
    window.addEventListener("pageshow", handlePageShow);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("pageshow", handlePageShow);
    }
  };
}

// getThemeChoice returns "system" | "light" | "dark" — a primitive, so no
// caching is needed for React to compare snapshots
function getSnapshot(): ThemeChoice {
  return getThemeChoice();
}

// On the server (and during the hydration render) localStorage is unknowable:
// "system" there, the saved choice right after mounting. No flash: the
// pre-paint script in the layout has already set <html data-theme>.
function getServerSnapshot(): ThemeChoice {
  return "system";
}

export interface ThemeControl {
  choice: ThemeChoice;
  changeTheme: (choice: ThemeChoice) => void;
}

// The System / Light / Dark switch's state. The <head> script already applied
// the saved theme before the page was drawn; this keeps it right afterwards.
export function useTheme(): ThemeControl {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // The CSS reads <html data-theme>: "light" or "dark" override the device
  // setting, and no attribute (System) follows the device
  useEffect(() => {
    const root = document.documentElement;
    if (choice === "system") {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = choice;
    }
  }, [choice]);

  // Only theme.state.ts saves the choice
  const changeTheme = useCallback((next: ThemeChoice) => {
    saveThemeChoice(next);
    emitChange();
  }, []);

  return { choice, changeTheme };
}
