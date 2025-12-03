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
  // Optimize fonts
  optimizeFonts: true,
  // Disable RSC prefetching for static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;

