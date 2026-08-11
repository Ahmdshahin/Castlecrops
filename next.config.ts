import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: 'standalone',
  // Hostinger may have a parent package-lock.json; pin tracing to this app only.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { 
        protocol: 'https', 
        hostname: 'nocischkvnhxkzpaockq.supabase.co',
        pathname: '/storage/v1/object/public/**'
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com'
      }
    ]
  }
};

export default withNextIntl(nextConfig);
