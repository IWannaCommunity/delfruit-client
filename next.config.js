const ExcludeAssetsPlugin = require("./exclude-assets.plugin.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	rootDir: "/src/",
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "192.168.0.13",
				port: "9000",
				pathname: "**",
			},
		],
	},
	transpilePackages: ["delfruit-swagger-cg-sdk"],
	typescript: {
		ignoreBuildErrors: true,
	},
	output: "standalone",
};

const withTM = require('next-transpile-modules')(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

module.exports = withTM(nextConfig);

