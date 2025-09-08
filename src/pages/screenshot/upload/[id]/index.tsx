import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UploadScreenshot, { GameProps } from "@/components/game/uploadScreenshot";
import { useEffect, useState } from "react";
import { AnyElem } from "@/utils/element";
import { useRouter } from "next/router";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { Config } from "@/utils/config";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

export default function ScreenshotUploadPage(): AnyElem {
	const [game, setGame] = useState<GameProps>();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [session] = useSessionContext();

	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);
		
		// Anti-trolling measures
		if (isNaN(id) || id < 0) {
			setError(true);
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await GAMES_API_CLIENT.getGame(id);
				const game = resp.data;

				if (!game || !game.id) {
					setError(true);
					return;
				}

				const newData: GameProps = {
					id: game.id,
					name: game.name
				};
				setGame(newData);
				setError(false);
			} catch (err: any) {
					if (err.response?.status === 404) {
						setError(true);
					}
			} finally {
				setLoading(false);
			}
		})();
	}, [router]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">Invalid Page</span>;
		
		return (
			<>
				{session.active ? (
					<UploadScreenshot game={game}/>
				) : (
					<span>You must login to view this page.</span>
				)}
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{renderContent()}
				</div>
				<Footer />
			</div>
		</div>
	);
}