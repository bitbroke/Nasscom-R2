import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-web', 'sharp'],
};
export default nextConfig;
