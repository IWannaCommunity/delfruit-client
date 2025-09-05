const CFG: Config = require("@/config.json");

export function makeScrnshotURL(gameId: number, screenshotId: number): URL {
	const screenshotIdAsUInt32: number = screenshotId >>> 0;

	return new URL(
		`${CFG.screenshotURLPrefix.toString()}/${gameId}_${screenshotIdAsUInt32
			.toString(16)
			.padStart(8, "0")}`,
	);
}
