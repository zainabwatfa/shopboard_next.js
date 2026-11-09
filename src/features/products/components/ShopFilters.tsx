import type { Ref } from "react";
import { SearchField } from "@/shared/components/SearchField";
import { SelectField } from "@/shared/components/SelectField";
import type { SelectOption } from "@/shared/components/SelectField";
import { parseCategory, parseSortKey } from "../products.logic.ts";
import type { Filters } from "../products.types.ts";

export interface ShopFiltersProps {
  filters: Filters;
  // Gets a function from the current filters to the new ones, so a quick
  // series of changes always builds on the latest filters
  onChange: (update: (current: Filters) => Filters) => void;
  searchRef: Ref<HTMLInputElement>;
}

const categoryOptions: readonly SelectOption[] = [
  { value: "all", label: "All categories" },
  { value: "Bags", label: "Bags" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
];

const sortOptions: readonly SelectOption[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

// The shop's search box, category filter and sort. The selects give plain
// text, so parseCategory / parseSortKey (products.logic.ts) check it.
export function ShopFilters({ filters, onChange, searchRef }: ShopFiltersProps) {
  return (
    <div
      role="search"
      className="mb-5 mt-6 grid gap-4 rounded-st-sm border-2 border-line bg-card p-5 shadow-ink-md sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
    >
      <div className="sm:col-span-full lg:col-span-1">
        <SearchField
          ref={searchRef}
          id="search"
          label="Search"
          placeholder="Try “leather” or “bag”"
          value={filters.query}
          onChange={(query) => onChange((current) => ({ ...current, query }))}
        />
      </div>
      <SelectField
        id="category-filter"
        label="Category"
        options={categoryOptions}
        value={filters.category}
        onChange={(value) =>
          onChange((current) => ({
            ...current,
            category: parseCategory(value),
          }))
        }
      />
      <SelectField
        id="sort"
        label="Sort by"
        options={sortOptions}
        value={filters.sortKey}
        onChange={(value) =>
          onChange((current) => ({ ...current, sortKey: parseSortKey(value) }))
        }
      />
    </div>
  );
}
