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
	},
	transpilePackages: ["delfruit-swagger-cg-sdk"],
	webpack: (cfg) => {
		cfg.module.rules?.push({
			test: new RegExp("/src/pages\/v2/"),
			loader: "ignore-loader",
		});
		return cfg;
	},
	output: "standalone",
};

const withTM = require('next-transpile-modules')(["delfruit-swagger-cg-sdk"]); // TODO: remove this once NextJS stops complaining about it

module.exports = withTM(nextConfig);

