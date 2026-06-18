/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // sharp is a native module — keep it external so the CMS upload route can
  // require it at runtime (it auto-optimises uploaded images).
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
