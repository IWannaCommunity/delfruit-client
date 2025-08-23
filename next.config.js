const path = require("node:path");

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
	webpack: {
		externals: {
		  jquery: "jQuery",
		  "jquery-ui": "jquery-ui",
		},
		resolve: {
			alias: {
				'@*': path.resolve(__dirname, "./src/"),
			},
		},
	},
};

const withTM = require('next-transpile-modules')(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NEXT_ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
	withTM(nextConfig)
);