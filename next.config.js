const path = require("node:path");
const webpack = require("webpack");

/** @type {import('next').NextConfig} */
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
	output: "standalone",
	webpack:  (cfg, opt) => {
		cfg.externals.push({
		  "isomorphic-dompurify": "DOMPurify",
		});
		
		cfg.plugins.push(new webpack.ProvidePlugin({
			DOMPurify: "isomorphic-dompurify",
		}))
		
		cfg.resolve = {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"jquery": "jquery/src/jquery",
				...cfg.resolve.alias,
			},
			extensions: [".js", ".ts", ".mjs", ".mts.", ".jsx", ".tsx", ".mjsx", ".mtsx", "..."]
		};
		
		cfg.module.rules.push({
			test: /\.md/,
			use: [opt.defaultLoaders.babel, {loader: "raw-loader", options: {esModule: false}}]
		});

		return cfg;
	},
};

const withTM = require('next-transpile-modules')(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NEXT_ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
	withTM(nextConfig)
);