import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [];
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 20000000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            maxSize: 20000000
          },
          shared: {
            name: (module, chunks, cacheGroupKey) => {
              const moduleFileName = module
                .identifier()
                .split('/')
                .reduceRight((item) => item)
              return `shared-${moduleFileName}`
            },
            chunks: 'all',
            minChunks: 2,
            maxSize: 20000000
          },
        },
      }
    }
    return config
  }
};

export default withBundleAnalyzer(withNextIntl(withMDX({
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
})));
