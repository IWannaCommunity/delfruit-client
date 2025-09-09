import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { makeScrnshotURL } from "@/utils/url";
import { API } from "@/utils/api";

export default function Screenshot(): AnyElem {
	const router = useRouter();

	const [screenshotURL, setScreenshotURL] = useState<URL>(undefined);
	const [screenshotGameName, setScreenshotGameName] = useState<string>("");
	const [screenshotDescription, setScreenshotDescription] = useState<string>("");

	const id = Number(router.query.id);

	useMemo(() => {
		if (!router.isReady) {
			return;
		}

		(async () => {
			const gameId = await (async () => {
				const resp = await API.screenshots().getScreenshot(id);
				setScreenshotURL(makeScrnshotURL(resp.data.gameId, resp.data.id));
				setScreenshotDescription(resp.data.description);
				return resp.data.gameId;
			})();

			const resp = await API.games().getGame(String(gameId));
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
						alt=""
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
