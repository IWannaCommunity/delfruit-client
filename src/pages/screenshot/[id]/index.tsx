import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";
import { GamesApi, ScreenshotsApi } from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { makeScrnshotURL } from "@/utils/url";
import { Config } from "@/utils/config";

const CFG: Config = require("@/config.json");

const SCRNSHOTSCLIENT: ScreenshotsApi = new ScreenshotsApi(
	void 0,
	CFG.apiURL.toString(),
);

const GAMESCLIENT: GamesApi = new GamesApi(void 0, CFG.apiURL.toString());

export default function Screenshot(): AnyElem {
	const router = useRouter();

	const [screenshotURL, setScreenshotURL] = useState<URL>(undefined);
	const [screenshotGameName, setScreenshotGameName] = useState<string>("");
	const [screenshotDescription, setScreenshotDescription] =
		useState<string>("");

	const id = Number(router.query.id);

	useMemo(() => {
		if (!router.isReady) {
			return;
		}

		(async () => {
			const gameId = await (async () => {
				const resp = await SCRNSHOTSCLIENT.getScreenshot(id);
				setScreenshotURL(makeScrnshotURL(resp.data.gameId, resp.data.id));
				setScreenshotDescription(resp.data.description);
				return resp.data.gameId;
			})();

			const resp = await GAMESCLIENT.getGame(String(gameId));
			setScreenshotGameName(resp.data.name);
		})();
	}, [router.isReady, id]);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<p>Screenshot for</p>
					<h2>{screenshotGameName}</h2>
					<Image
						className="w-full"
						src={screenshotURL?.toString()}
						width={-1}
						height={-1}
					/>
					<p>
						<span>{screenshotDescription}</span>
						<br />
						<Link href="/">Report this image</Link>
					</p>

					<h2>Admin Tools</h2>
					<p id="admin_controls">
						<Link href="/">Remove Screenshot</Link>
					</p>
				</div>
				<Footer />
			</div>
		</div>
	);
}
