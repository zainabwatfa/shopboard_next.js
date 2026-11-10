import type { Ref } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format.ts";

// What a valid submit produces: the summary the confirmation card shows
export interface ConfirmedOrder {
  id: string;
  total: number;
  customerName: string;
  email: string;
  shippingMethod: string;
  address: string;
  city: string;
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

export interface OrderConfirmationProps {
  order: ConfirmedOrder;
  // The page moves keyboard focus here once the form has disappeared
  headingRef: Ref<HTMLHeadingElement>;
}

// The green confirmation card shown after a (simulated) order
export function OrderConfirmation({
  order,
  headingRef,
}: OrderConfirmationProps) {
  return (
    <section aria-labelledby="confirmation-heading" className="pb-16">
      <Card tint="green" size="lg" className="max-w-2xl p-7">
        <h2
          id="confirmation-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mb-3 mt-0 font-poster text-4xl font-black tracking-tight"
        >
          Order confirmed!
        </h2>
        <p className="mb-6 leading-[1.5]">
          Thank you, {order.customerName}! Your simulated demo order has been
          placed. A confirmation summary has been generated below.
        </p>
        <dl className="m-0">
          <ConfirmationRow label="Order number" value={order.id} />
          <ConfirmationRow label="Customer" value={order.email} />
          <ConfirmationRow
            label="Shipping to"
            value={`${order.address}, ${order.city}`}
          />
          <ConfirmationRow
            label="Shipping method"
            value={order.shippingMethod}
          />
          <ConfirmationRow
            label="Amount paid"
            value={formatMoney(order.total)}
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
