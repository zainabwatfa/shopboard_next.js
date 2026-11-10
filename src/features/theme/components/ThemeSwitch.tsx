"use client";

import { Fragment } from "react";
import type { ReactNode, SVGAttributes } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "../hooks/useTheme";
import type { ThemeChoice } from "../theme.types.ts";

type ThemeOption = {
  value: ThemeChoice;
  label: string;
  icon: ReactNode;
};

// The same icons as the first ShopBoard site. Decorative: the label is hidden text.
const iconProps: SVGAttributes<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "size-5",
};

const options: readonly ThemeOption[] = [
  {
    value: "system",
    label: "System",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    value: "light",
    label: "Light",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg {...iconProps}>
        <path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a7.5 7.5 0 0 0 10 10z" />
      </svg>
    ),
  },
];

// A pill with three round options. The radios are visually hidden (sr-only)
// but keep the keyboard focus; each label is a round target. The negative
// margins let each circle cover the pill's border, so the chosen circle's
// outline lines up with the pill's outline. autoComplete="off" stops the
// browser from putting back an old choice after Back/Forward.
export function ThemeSwitch() {
  const { choice, changeTheme } = useTheme();

  return (
    <fieldset className="group relative m-0 flex min-w-0 rounded-full border-2 border-line bg-card p-0 min-[24rem]:gap-0.5 sm:justify-self-end">
      <legend className="sr-only">Theme</legend>
      {options.map((option, index) => (
        <Fragment key={option.value}>
          <input
            id={`theme-${option.value}`}
            type="radio"
            name="theme"
            value={option.value}
            autoComplete="off"
            checked={choice === option.value}
            onChange={() => changeTheme(option.value)}
            className="peer sr-only"
          />
          <label
            htmlFor={`theme-${option.value}`}
            title={option.label}
            className={cn(
              "-my-0.5 grid size-10 cursor-pointer place-items-center rounded-full border-2 border-transparent bg-clip-padding text-smoke min-[24rem]:size-11",
              index === 0 && "-ms-0.5",
              index === options.length - 1 && "-me-0.5",
              "hover:bg-[color-mix(in_srgb,var(--color-st-lav)_30%,transparent)] hover:text-ink",
              // The chosen option: a lavender sticker circle, ink icon in both themes
              "peer-checked:border-line peer-checked:bg-st-lav peer-checked:text-on-fill",
              // The hidden radio has the focus, so its label shows the ring
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
              // Colours animate only while the switch is in use, so the saved
              // choice appears without animating on every page load
              "group-focus-within:transition-colors group-hover:transition-colors motion-reduce:transition-none",
              // High contrast mode removes the lavender fill: system colours mark the choice
              "forced-colors:peer-checked:border-[CanvasText] forced-colors:peer-checked:bg-[Highlight] forced-colors:peer-checked:text-[HighlightText] forced-colors:peer-checked:[forced-color-adjust:none]",
            )}
          >
            {option.icon}
            <span className="sr-only">{option.label}</span>
          </label>
        </Fragment>
      ))}
    </fieldset>
  );
}
