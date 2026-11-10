"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";
import { getCartLines, getCartTotal } from "@/features/cart/cart.logic.ts";
import { useCart } from "@/features/cart/hooks/useCart.ts";
import { useCartCleanup } from "@/features/cart/hooks/useCartCleanup";
import type { Product } from "@/features/products/products.types.ts";
import { DEFAULT_CHECKOUT_VALUES, checkoutSchema } from "../checkout.schema.ts";
import type { CheckoutFormValues } from "../checkout.schema.ts";
import { SelectInput, TextField } from "./CheckoutFields";
import { CheckoutSummary } from "./CheckoutSummary";
import { OrderConfirmation } from "./OrderConfirmation";
import type { ConfirmedOrder } from "./OrderConfirmation";

export interface CheckoutViewProps {
  products: readonly Product[];
}

// The simulated checkout: react-hook-form owns the fields, Zod
// (checkout.schema.ts, a copied Day 3-style file) owns the rules, and
// zodResolver connects them. Nothing is sent anywhere: a valid submit
// builds a confirmation and clears the cart.
export function CheckoutView({ products }: CheckoutViewProps) {
  const { state: cart, actions } = useCart();
  useCartCleanup(products);

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
      <OrderConfirmation order={confirmedOrder} headingRef={confirmationRef} />
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

      <CheckoutSummary
        lines={lines}
        count={cart.count}
        subtotal={subtotal}
        shippingCost={shippingCost}
        grandTotal={grandTotal}
      />
    </div>
  );
}
