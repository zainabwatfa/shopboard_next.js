import type { Ref } from "react";
import { Input } from "@/components/ui/input";

export interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  // Lets the page move keyboard focus here (after "Clear filters")
  ref?: Ref<HTMLInputElement>;
}

// A labelled search box: label above the Input
export function SearchField({
  id,
  label,
  value,
  placeholder,
  onChange,
  ref,
}: SearchFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      <Input
        ref={ref}
        id={id}
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
