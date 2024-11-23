import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
  webpack: (config) => {

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
  
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.output = {
      ...config.output,
      webassemblyModuleFilename: 'static/wasm/[modulehash].wasm',
    };

    return config;
  },
};

export default nextConfig;
