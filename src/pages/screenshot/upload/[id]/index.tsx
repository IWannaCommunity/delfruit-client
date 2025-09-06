import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UploadScreenshot, { GameProps } from "@/components/game/uploadScreenshot";
import { useEffect, useState } from "react";
import { AnyElem } from "@/utils/element";
import { useRouter } from "next/router";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

export default function ScreenshotUploadPage(): AnyElem {
	const [game, setGame] = useState<GameProps>();
	const [error, setError] = useState<string | null>(null);
	const [session] = useSessionContext();

	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;
		setError(null);

		const id = Number(router.query.id);
		
		// Anti-trolling measures
		if (isNaN(id) || id < 0) {
			setError("Invalid page.")
			return;
		}

		(async () => {
			const resp = await GAMES_API_CLIENT.getGame(id);
			const user = resp.data;
			const newData: GameProps = {
				id: user.id,
				name: user.name
			};
			setGame(newData);
		})();
	}, [router]);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{error && <span className="text-red-600 ml-1">{error}</span>}
					{!session.active && !error && (
						<span>You must login to view this page.</span>
					)}
					{session.active && !error && (
						<UploadScreenshot game={game}/>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}