"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/shared/components/Eyebrow";
import type { HeroTile } from "../hero.ts";

export interface HeroProps {
  // The picture tiles, one per product (see ../hero.ts)
  tiles: readonly HeroTile[];
  // How many products the shop has; the round sticker shows it once known
  productCount: number;
  // A tile was clicked: the shop searches for that product
  onPick: (tile: HeroTile) => void;
}

// Position, rotation and sticker pair of the three tilted tiles
const tilePlacement: readonly string[] = [
  "inset-[2%_32%_30%_0] -rotate-[4deg] [--st-tint:var(--color-st-lav)] [--st-shade:var(--color-st-lav-shade)]",
  "inset-[34%_1%_2%_42%] rotate-[5deg] [--st-tint:var(--color-st-pink)] [--st-shade:var(--color-st-pink-shade)]",
  "inset-[58%_50%_-1%_4%] -rotate-[8deg] [--st-tint:var(--color-st-green)] [--st-shade:var(--color-st-green-shade)]",
];

// The top of the shop: the title and buttons on the left, three tilted
// product tiles and a round sticker on the right.
export function Hero({ tiles, productCount, onPick }: HeroProps) {
  function handleTileClick(
    event: MouseEvent<HTMLAnchorElement>,
    tile: HeroTile,
  ): void {
    // Ctrl/Cmd/Shift-click opens the link as usual (new tab or window)
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    event.preventDefault();
    onPick(tile);
  }

  return (
    <section
      className="overflow-hidden pb-16 pt-10"
      aria-labelledby="hero-title"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Eyebrow>Bags · Shoes · Accessories</Eyebrow>
          <h1
            id="hero-title"
            className="mb-4 font-poster text-[clamp(3.125rem,7vw,7rem)] font-black leading-[0.92] tracking-tight [text-wrap:balance]"
          >
            Carry what <em className="not-italic text-accent">matters</em>.
          </h1>
          <p className="max-w-xl text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.45] text-smoke">
            Everyday pieces, chosen with care. Find yours in seconds, and your
            cart waits for you until you&rsquo;re ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="#products-title">Shop the collection</ButtonLink>
            <ButtonLink variant="secondary" href="/cart">
              View your cart
            </ButtonLink>
          </div>
          <p className="mt-7 font-mono text-[0.8125rem] leading-normal text-smoke">
            A demo shop for a course: nothing is really sold.
          </p>
        </div>

        {/* Each tile searches the shop for its product; the picture is
            decorative, the hidden name is the link text */}
        <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
          {tiles.map((tile, position) => (
            <Link
              key={tile.id}
              href={`/?q=${encodeURIComponent(tile.name)}`}
              onClick={(event) => handleTileClick(event, tile)}
              className={cn(
                "absolute rounded-st border-2 border-line bg-(--st-tint) p-[9%] shadow-st-lg",
                "hover:z-1 hover:shadow-[11px_11px_0_var(--st-shade)] focus-visible:z-1 active:shadow-st-sm",
                "motion-safe:transition-[transform,box-shadow] motion-safe:duration-150 motion-safe:ease-st motion-safe:hover:-translate-x-[3px] motion-safe:hover:-translate-y-[3px] motion-safe:active:translate-x-[3px] motion-safe:active:translate-y-[3px]",
                tilePlacement[position],
              )}
            >
              <Image
                src={`/${tile.image}`}
                alt=""
                width={200}
                height={200}
                className="h-full w-full rounded-st-xs object-contain"
              />
              <span className="sr-only">{tile.name}</span>
            </Link>
          ))}
          {productCount > 0 ? (
            <p
              aria-hidden="true"
              className="absolute right-[3%] top-0 m-0 grid aspect-square w-[clamp(5.5rem,24vw,7rem)] rotate-12 place-items-center rounded-full border-2 border-line bg-st-yellow text-center font-mono text-xs leading-none uppercase tracking-[0.08em] text-on-fill shadow-[4px_4px_0_var(--color-line)]"
            >
              <span>
                <strong className="mb-0.5 block font-poster text-[2.375rem] font-black leading-[0.9] tracking-tight">
                  {productCount}
                </strong>
                pieces
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
