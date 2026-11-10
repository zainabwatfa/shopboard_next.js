import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/features/cart/components/CartProvider";
import { ThemeSwitch } from "@/features/theme/components/ThemeSwitch";
import { Footer } from "@/shared/components/Footer";
import { Header } from "@/shared/components/Header";
import { MainNav } from "@/shared/components/MainNav";
import { FOOTER_GROUPS } from "@/lib/siteLinks.ts";
import "./globals.css";

// Applies the saved theme before the first paint, so a dark-theme visitor
// never sees a light flash. It runs before React exists, reading the same
// localStorage key theme.state.ts writes ("light"/"dark"; System saves
// nothing). React is told not to compare <html>'s attributes during
// hydration (suppressHydrationWarning), since this script legitimately made
// them differ from the server's HTML.
const themeScript = `try{var t=localStorage.getItem("shopboard-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShopBoard",
    template: "%s · ShopBoard",
  },
  description:
    "ShopBoard is a demo shop built for a course. Nothing is really sold.",
};

// What every page has around its content: skip link, header (logo, nav),
// <main id="main"> and footer. CartProvider sits at the top, so the header
// badge and the pages share one cart.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <CartProvider>
          <a
            href="#main"
            className="absolute -top-16 left-4 z-[101] rounded-full border-2 border-line bg-st-pink px-4 py-2.5 font-bold text-on-fill shadow-st-sm [--st-shade:var(--color-st-pink-shade)] focus:top-4"
          >
            Skip to main content
          </a>
          <Header>
            <MainNav />
            <ThemeSwitch />
          </Header>
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-5">
            {children}
          </main>
          <Footer groups={FOOTER_GROUPS} />
        </CartProvider>
      </body>
    </html>
  );
}
