import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/shared/config/i18n/request.ts"); // ✅ custom i18n joyini ko‘rsatamiz!

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/icons/{{member}}",
      skipDefaultConversion: true,
      preventFullImport: true,
    },
  },
  experimental: {
    serverActions: {},
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-separator",
      "@radix-ui/react-tooltip",
    ],
  },
};

export default withNextIntl(nextConfig);
