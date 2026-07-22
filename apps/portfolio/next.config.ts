import type { NextConfig } from "next";

// Static export → GitHub Pages.
// - Default (DEPLOY_TARGET unset): user page at eva813.github.io, no basePath.
// - DEPLOY_TARGET=project: project page at eva813.github.io/eva-site, needs basePath.
//   The preview workflow sets DEPLOY_TARGET=project; production leaves it unset.
const isProject = process.env.DEPLOY_TARGET === "project";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProject ? "/eva-site" : "",
  assetPrefix: isProject ? "/eva-site/" : "",
};

export default nextConfig;
