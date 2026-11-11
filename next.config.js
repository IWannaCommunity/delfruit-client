const path = require("node:path");
const webpack = require("webpack");
const { execSync } = require("node:child_process");

function git(cmd) {
  try {
    return (
      execSync(`git ${cmd}`, {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() || null
    );
  } catch {
    return null;
  }
}

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.13",
        port: "9000",
        pathname: "**",
      },
    ],
    unoptimized: true,
  },
  transpilePackages: ["delfruit-swagger-cg-sdk"],
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone", // TODO: change to "export"
  webpack: (cfg, opt) => {
    cfg.externals.push({
      "isomorphic-dompurify": "DOMPurify",
    });

    cfg.plugins.push(
      new webpack.ProvidePlugin({
        DOMPurify: "isomorphic-dompurify",
      }),
    );

    cfg.resolve = {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        jquery: "jquery/src/jquery",
        ...cfg.resolve.alias,
      },
      extensions: [
        ...cfg.resolve.extensions,
        ".js",
        ".ts",
        ".mjs",
        ".mts.",
        ".jsx",
        ".tsx",
        ".mjsx",
        ".mtsx",
        "...",
      ],
    };

    cfg.module.rules.push({
      test: /\.md/,
      use: [opt.defaultLoaders.babel, { loader: "raw-loader", options: { esModule: false } }],
    });

    return cfg;
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
	NEXT_PUBLIC_APP_NAME: process.env.npm_package_name,
    //NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV
    //NEXT_PUBLIC_GIT_COMMIT: process.env.DO_GIT_COMMIT || git("rev-parse HEAD"),
    //NEXT_PUBLIC_GIT_SHORT_COMMIT: process.env.DO_GIT_SHORT_COMMIT || git("rev-parse --short HEAD"),
    //NEXT_PUBLIC_GIT_BRANCH: process.env.DO_GIT_BRANCH || git("rev-parse --abbrev-ref HEAD"),
    //NEXT_PUBLIC_GIT_TAG: process.env.DO_GIT_TAG || git("describe --tags --exact-match"),
    //NEXT_PUBLIC_GIT_NEAREST_TAG: process.env.DO_GIT_NEAREST_TAG || git("describe --tags --abbrev=0"),
    //NEXT_PUBLIC_GIT_DIRTY: process.env.DO_GIT_DIRTY || git("status --porcelain").length > 0
  },
};

const withTM = require("next-transpile-modules")(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.NEXT_ANALYZE === "true",
});

module.exports = withBundleAnalyzer(withTM(nextConfig));
