export interface Config {
	apiURL: URL;
	screenshotURLPrefix: URL;
}

import rawConfig from "@/config.json";

export const CFG: Config = {
  apiURL: new URL(rawConfig.apiURL),
  screenshotURLPrefix: new URL(rawConfig.screenshotURLPrefix),
};