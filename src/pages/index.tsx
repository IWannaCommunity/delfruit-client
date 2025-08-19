import Head from "next/head";
import Header from "../components/header";
import News from "../components/home/news";
import GameList from "../components/home/gameList";
import ReviewList from "../components/home/reviewList";
import { CompositeApi } from "delfruit-swagger-cg-sdk";
import { useMemo, useState } from "react";
import { GameProps } from "../components/game";
import type { Config } from "../utils/config";

const CFG: Config = require("../config.json");

const apiClient: CompositeApi = new CompositeApi(void 0, CFG.apiURL.toString());

export default function Home(): JSX.Element {
	const [games, setGames] = useState<GameProps[]>([]);

	useMemo(() => {
		(async () => {
			let resp = await apiClient.getGamesWithRatings(
				void 0,
				void 0,
				false,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
				new Date(Date.now()),
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				0,
				25,
				"date_created",
				"desc",
			);
			const gameProps: Array<GameProps> = new Array(resp.data.length);
			for (const game of resp.data) {
				gameProps.push({
					name: game.name,
					id: game.id,
					date: game.dateCreated,
					rating: game.ratings.rating,
					difficulty: game.ratings.difficulty,
					numOfRatings: game.rating_count,
				});
			}
			setGames(gameProps);
		})();
	}, []);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<News />
					<GameList games={games} />
					<ReviewList />
				</div>
			</div>
		</div>
	);
}
