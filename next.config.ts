import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /^pino-pretty$/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /^@react-native-async-storage\/async-storage$/ })
      );
    }
    return config;
  },
};

export default nextConfig;
