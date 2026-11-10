"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { selectControlClasses } from "@/shared/components/SelectField";

// One labelled text input wired to react-hook-form: registration carries
// name, ref and the change/blur handlers from register(). The error turns
// the label and the Input red (aria-invalid) and is read with the field
// (aria-describedby).
export type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error: string | undefined;
  registration: UseFormRegisterReturn;
};

export function TextField({
  label,
  placeholder,
  type = "text",
  error,
  registration,
}: TextFieldProps) {
  const id = registration.name;
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={cn("text-sm font-bold", error ? "text-down" : "text-ink")}
      >
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={error === undefined ? undefined : true}
        aria-describedby={error === undefined ? undefined : errorId}
        {...registration}
      />
      {error === undefined ? null : (
        <p
          id={errorId}
          className="m-0 text-[0.8125rem] font-semibold text-down"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// A labelled select wired the same way, with a small description line
export type SelectInputProps = {
  label: string;
  description: string;
  registration: UseFormRegisterReturn;
  options: readonly { value: string; label: string }[];
};

export function SelectInput({
  label,
  description,
  registration,
  options,
}: SelectInputProps) {
  const id = registration.name;
  const hintId = `${id}-hint`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      <select
        id={id}
        aria-describedby={hintId}
        className={selectControlClasses}
        {...registration}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p id={hintId} className="m-0 text-[0.8125rem] text-smoke">
        {description}
      </p>
    </div>
  );
}
