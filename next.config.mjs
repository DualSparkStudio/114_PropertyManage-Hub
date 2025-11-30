/** @type {import('next').NextConfig} */
const isGithubPages = process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true';
const repositoryName = process.env.GITHUB_REPOSITORY_NAME || '114_PropertyManage-Hub';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repositoryName}` : '',
  assetPrefix: isGithubPages ? `/${repositoryName}` : '',
  trailingSlash: true,
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize bundle
  swcMinify: true,
  // Enable compression
  compress: true,
  // Optimize fonts
  optimizeFonts: true,
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate chunk for lucide-react (large icon library)
            lucide: {
              name: 'lucide',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              chunks: 'all',
              priority: 30,
            },
          },
        },
      }
    }
    return config
  },
};

export default nextConfig;

