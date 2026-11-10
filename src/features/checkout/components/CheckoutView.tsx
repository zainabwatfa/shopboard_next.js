"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format.ts";
import { selectControlClasses } from "@/shared/components/SelectField";
import { getCartLines, getCartTotal } from "@/features/cart/cart.logic.ts";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { ProductImage } from "@/features/products/components/ProductImage";
import type { Product } from "@/features/products/products.types.ts";
import {
  DEFAULT_CHECKOUT_VALUES,
  checkoutSchema,
} from "../checkout.schema.ts";
import type { CheckoutFormValues } from "../checkout.schema.ts";

interface ConfirmedOrder {
  id: string;
  total: number;
  customerName: string;
  email: string;
  shippingMethod: string;
  address: string;
  city: string;
}

// One labelled text input wired to react-hook-form: registration carries
// name, ref and the change/blur handlers from register(). The error turns
// the label and the Input red (aria-invalid) and is read with the field
// (aria-describedby).
type TextFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error: string | undefined;
  registration: UseFormRegisterReturn;
};

function TextField({
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
        <p id={errorId} className="m-0 text-[0.8125rem] font-semibold text-down">
          {error}
        </p>
      )}
    </div>
  );
}

// A labelled select wired the same way, with a small description line
type SelectInputProps = {
  label: string;
  description: string;
  registration: UseFormRegisterReturn;
  options: readonly { value: string; label: string }[];
};

function SelectInput({
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

export interface CheckoutViewProps {
  products: readonly Product[];
}

// The simulated checkout: react-hook-form owns the fields, Zod
// (checkout.schema.ts, a copied Day 3-style file) owns the rules, and
// zodResolver connects them. Nothing is sent anywhere: a valid submit
// builds a confirmation and clears the cart.
export function CheckoutView({ products }: CheckoutViewProps) {
  const { state: cart, actions } = useCart();

  // Once the products are known, drop cart items whose product no longer exists
  useEffect(() => {
    actions.keepOnly(products.map((product) => product.id));
  }, [products, actions]);

  const [orderCounter, setOrderCounter] = useState(10482);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null,
  );
  const confirmationRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: DEFAULT_CHECKOUT_VALUES,
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const lines = getCartLines(cart.items, products);
  const subtotal = getCartTotal(cart.items, products);

  const shippingMethod = useWatch({
    control: form.control,
    name: "shippingMethod",
  });
  const shippingCost = shippingMethod === "express" ? 15 : 0;
  const grandTotal = subtotal + shippingCost;

  function onSubmit(values: CheckoutFormValues): void {
    if (lines.length === 0) return;

    const orderId = `SB-${orderCounter}`;
    setOrderCounter((previous) => previous + 1);

    setConfirmedOrder({
      id: orderId,
      total: grandTotal,
      customerName: values.fullName,
      email: values.email,
      shippingMethod:
        values.shippingMethod === "express"
          ? "Express (1-2 business days)"
          : "Standard (3-5 business days)",
      address: values.address,
      city: values.city,
    });

    actions.clear();
    // The form the focus was in is about to disappear: the confirmation
    // heading takes it once the new view is drawn
    requestAnimationFrame(() => confirmationRef.current?.focus());
  }

  if (confirmedOrder !== null) {
    return (
      <section aria-labelledby="confirmation-heading" className="pb-16">
        <Card tint="green" size="lg" className="max-w-2xl p-7">
          <h2
            id="confirmation-heading"
            ref={confirmationRef}
            tabIndex={-1}
            className="mb-3 mt-0 font-poster text-4xl font-black tracking-tight"
          >
            Order confirmed!
          </h2>
          <p className="mb-6 leading-[1.5]">
            Thank you, {confirmedOrder.customerName}! Your simulated demo order
            has been placed. A confirmation summary has been generated below.
          </p>
          <dl className="m-0">
            <ConfirmationRow label="Order number" value={confirmedOrder.id} />
            <ConfirmationRow label="Customer" value={confirmedOrder.email} />
            <ConfirmationRow
              label="Shipping to"
              value={`${confirmedOrder.address}, ${confirmedOrder.city}`}
            />
            <ConfirmationRow
              label="Shipping method"
              value={confirmedOrder.shippingMethod}
            />
            <ConfirmationRow
              label="Amount paid"
              value={formatMoney(confirmedOrder.total)}
            />
            <ConfirmationRow label="Status" value="Demo completed" />
          </dl>
          <div className="mt-8">
            <ButtonLink href="/" variant="secondary">
              Continue shopping
            </ButtonLink>
          </div>
        </Card>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mb-16 mt-2 flex flex-col items-center gap-3 rounded-st-sm border-2 border-dashed border-hairline-2 bg-surface px-6 py-10 text-center text-smoke">
        <p className="m-0 text-lg font-bold text-ink">
          Your cart is empty. Add products before checking out.
        </p>
        <ButtonLink href="/">Browse products</ButtonLink>
      </div>
    );
  }

  return (
    <div className="mb-16 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
      <Card tint="pink" size="lg" className="p-6">
        <form
          className="grid gap-5"
          // Built inside the event handler, not during render, so the lint
          // rule knows onSubmit's ref is only touched on an actual submit
          onSubmit={(event) => {
            void form.handleSubmit(onSubmit)(event);
          }}
          noValidate
        >
          <h2 className="m-0 font-poster text-2xl font-black tracking-tight">
            Contact &amp; Shipping
          </h2>

          <TextField
            label="Full name"
            placeholder="Jane Doe"
            error={errors.fullName?.message}
            registration={form.register("fullName")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Email address"
              type="email"
              placeholder="jane@example.com"
              error={errors.email?.message}
              registration={form.register("email")}
            />
            <TextField
              label="Phone"
              type="tel"
              placeholder="+1 555 000 1234"
              error={errors.phone?.message}
              registration={form.register("phone")}
            />
          </div>

          <TextField
            label="Street address"
            placeholder="123 Market Street"
            error={errors.address?.message}
            registration={form.register("address")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="City"
              placeholder="San Francisco"
              error={errors.city?.message}
              registration={form.register("city")}
            />
            <TextField
              label="Postal code"
              placeholder="94103"
              error={errors.postalCode?.message}
              registration={form.register("postalCode")}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectInput
              label="Shipping method"
              description="Express delivers within 1-2 business days."
              registration={form.register("shippingMethod")}
              options={[
                {
                  value: "standard",
                  label: "Standard Delivery (Free, 3-5 days)",
                },
                {
                  value: "express",
                  label: "Express Delivery ($15.00, 1-2 days)",
                },
              ]}
            />
            <SelectInput
              label="Payment method"
              description="Simulated demo payment only."
              registration={form.register("paymentMethod")}
              options={[
                { value: "card", label: "Credit / Debit Card (Simulated)" },
                { value: "demo", label: "Demo Express Checkout" },
              ]}
            />
          </div>

          <TextField
            label="Delivery instructions (optional)"
            placeholder="e.g. Leave package on the porch"
            error={errors.notes?.message}
            registration={form.register("notes")}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2"
          >
            Place demo order ({formatMoney(grandTotal)})
          </Button>
        </form>
      </Card>

      <aside aria-label="Order summary">
        <Card tint="ink" size="lg" className="flex flex-col gap-4 p-6">
          <h2 className="m-0 font-poster text-2xl font-black tracking-tight">
            Order summary ({cart.count} items)
          </h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] items-center gap-x-3"
              >
                <ProductImage
                  src={line.product.image}
                  size={60}
                  sizes="2.5rem"
                  className="aspect-square size-10 rounded-st-xs border-[1.5px] border-hairline-2 bg-[color-mix(in_srgb,var(--st-tint)_45%,var(--color-st-paper))] object-cover"
                />
                <span className="text-sm font-semibold leading-tight [overflow-wrap:anywhere]">
                  {line.product.name}
                </span>
                <span className="font-mono text-xs text-smoke">
                  Qty {line.qty}
                </span>
                <span className="text-right font-mono text-sm tabular-nums">
                  {formatMoney(line.product.price * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 border-t-2 border-dashed border-hairline-2 pt-4">
            Subtotal{" "}
            <strong className="font-mono text-[0.9375rem] tabular-nums">
              {formatMoney(subtotal)}
            </strong>
          </p>
          <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4">
            Shipping{" "}
            <strong className="font-mono text-[0.9375rem] tabular-nums">
              {shippingCost === 0 ? "Free" : formatMoney(shippingCost)}
            </strong>
          </p>
          <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-4 border-t-2 border-line pt-4 font-bold">
            Total{" "}
            <strong className="font-poster text-2xl font-black tabular-nums">
              {formatMoney(grandTotal)}
            </strong>
          </p>
        </Card>
      </aside>
    </div>
  );
}

// One line of the confirmation: "Order number — SB-10482"
function ConfirmationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-t border-on-fill/20 py-2 first:border-t-0">
      <dt className="text-sm">{label}</dt>
      <dd className="m-0 font-bold [overflow-wrap:anywhere]">{value}</dd>
    </div>
  );
}
