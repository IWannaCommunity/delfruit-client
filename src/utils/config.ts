import rawConfig from "@/config.json";

export interface Config {
	apiURL: URL;
	screenshotURLPrefix: URL;
	cfTurnstileSiteKey: string;
}

export const CFG: Config = {
	apiURL: new URL(rawConfig.apiURL),
	screenshotURLPrefix: new URL(rawConfig.screenshotURLPrefix),
	cfTurnstileSiteKey: rawConfig.cfTurnstileSiteKey,
};

