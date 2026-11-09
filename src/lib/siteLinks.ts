// The footer's links. Data only: Footer.tsx turns the groups into columns.
// Unlike the GitHub Pages versions, this site is served from the root, so
// links inside the site are plain routes starting with "/".

export type SiteLink = {
  href: string;
  label: string;
};

export type LinkGroup = {
  heading: string;
  links: readonly SiteLink[];
};

const REPO_URL = "https://github.com/zainabwatfa/shopboard_next.js";

// Only pages that exist in this site, plus the photo credits and the code on GitHub
export const FOOTER_GROUPS: readonly LinkGroup[] = [
  {
    heading: "Shop",
    links: [
      { href: "/", label: "All products" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    heading: "About",
    links: [
      { href: `${REPO_URL}/blob/main/CREDITS.md`, label: "Photo credits" },
      { href: REPO_URL, label: "Source code" },
    ],
  },
];
