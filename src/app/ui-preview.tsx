"use client";

import { useState } from "react";
import { Badge, type BadgeTint } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, type CardTint } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

/* Temporary page: a quick look at the five ui primitives in both themes.
   It goes away when the real shop page is built. */

const cardTints: ReadonlyArray<CardTint> = ["lav", "pink", "green", "yellow"];
const badgeTints: ReadonlyArray<BadgeTint> = ["yellow", "lav", "pink", "green"];

export function UiPreview() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-poster text-3xl font-black">Buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Add to cart</Button>
          <Button variant="secondary">View details</Button>
          <Button size="sm">Try again</Button>
          <Button variant="secondary" size="sm">
            Clear filters
          </Button>
          <Button variant="secondary" size="icon" aria-label="Increase">
            +
          </Button>
          <Button variant="quiet">Remove</Button>
          <ButtonLink href="/">Browse the shop</ButtonLink>
        </div>
      </section>

      <section className="flex max-w-sm flex-col gap-4">
        <h2 className="font-poster text-3xl font-black">Input</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="preview-name" className="text-sm font-bold">
            Full name
          </label>
          <Input id="preview-name" placeholder="Jane Doe" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="preview-email" className="text-sm font-bold">
            Email
          </label>
          <Input
            id="preview-email"
            type="email"
            defaultValue="not-an-email"
            aria-invalid="true"
            aria-describedby="preview-email-error"
          />
          <p
            id="preview-email-error"
            className="text-[0.8125rem] font-semibold text-down"
          >
            Enter a valid email address.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-poster text-3xl font-black">
          Badges <Badge>3</Badge>
        </h2>
        <div className="flex items-center gap-3">
          {badgeTints.map((tint) => (
            <Badge key={tint} tint={tint}>
              12
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-poster text-3xl font-black">Cards</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardTints.map((tint) => (
            <Card key={tint} tint={tint} className="p-5">
              <p className="font-mono text-[0.6875rem] tracking-widest uppercase text-smoke">
                {tint}
              </p>
              <h3 className="text-base font-semibold">Sticker card</h3>
              <p className="font-poster text-2xl font-black">$24.00</p>
            </Card>
          ))}
        </div>
        <Card tint="lav" size="lg" filled className="max-w-md p-7">
          <h3 className="font-poster text-2xl font-black">Filled card</h3>
          <p>Tint background, ink text in both themes.</p>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-poster text-3xl font-black">Modal</h2>
        <div>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Clear cart…
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Clear the cart?"
        >
          <p className="mb-5 text-smoke">
            This removes every item. Your saved items can’t be brought back.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Keep items
            </Button>
            <Button onClick={() => setModalOpen(false)}>Clear cart</Button>
          </div>
        </Modal>
      </section>
    </div>
  );
}
