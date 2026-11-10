import { fieldControlClasses, fieldFocusClasses } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: readonly SelectOption[];
  // The chosen option's value as plain text: the caller checks it
  onChange: (value: string) => void;
}

// The select look: the Input's field classes plus a chevron drawn with two
// tiny gradients, so it follows the text colour in both themes. Shared with
// the checkout form's selects.
export const selectControlClasses = cn(
  fieldControlClasses,
  "cursor-pointer pr-11 bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-position-[calc(100%_-_1.375rem)_52%,calc(100%_-_1rem)_52%] bg-size-[0.375rem_0.375rem] bg-no-repeat",
  fieldFocusClasses,
);

// A labelled drop-down, drawn like the Input.
export function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectControlClasses}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
