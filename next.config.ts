import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // From the create-next-app template: "use cache" support, prefetching of
  // the static part of dynamic pages, and the Tailwind v4 loader — without
  // the turbopack rule, @theme is an unknown at-rule and no utility classes
  // are generated at all.
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The first two ShopBoard versions also answered /product/3 (singular);
  // old links keep working with a permanent redirect
  async redirects() {
    return [
      {
        source: "/product/:id",
        destination: "/products/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
