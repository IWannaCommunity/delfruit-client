import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UploadScreenshot, { GameProps } from "@/components/game/uploadScreenshot";
import { useEffect, useState } from "react";
import { AnyElem } from "@/utils/element";
import { useRouter } from "next/router";
import { API } from "@/utils/api";
import { useSessionContext } from "@/utils/hooks";

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
				const resp = await API.games().getGame(id);
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