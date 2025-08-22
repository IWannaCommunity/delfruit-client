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
	productionBrowserSourceMaps: true,
	output: "standalone",
};

const withTM = require('next-transpile-modules')(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

module.exports = withTM(nextConfig);

