import Head from "next/head";
import Header from "../components/header";
import News from "../components/home/news";
import GameList from "../components/home/gameList";
import ReviewList from "../components/home/reviewList";
import { CompositeApi, Review, ReviewsApi } from "delfruit-swagger-cg-sdk";
import { useEffect, useState } from "react";
import { GameProps } from "../components/game";
import type { Config } from "../utils/config";

const CFG: Config = require("../config.json");

const COMPOSITEAPICLIENT: CompositeApi = new CompositeApi(
	void 0,
	CFG.apiURL.toString(),
);
const REVIEWSAPICLIENT: ReviewsApi = new ReviewsApi(
	void 0,
	CFG.apiURL.toString(),
);

export default function Home(): NextPage {
	const [games, setGames] = useState<GameProps[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		if (games.length === 0) {
			(async () => {
				let resp = await COMPOSITEAPICLIENT.getGamesWithRatings(
					void 0,
					void 0,
					false,
					void 0,
					void 0,
					void 0,
					void 0,
					void 0,
					//new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
					void 0,
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
						rating: game.rating,
						difficulty: game.difficulty,
						numOfRatings: game.rating_count,
					});
				}
				setGames(gameProps);
			})();
		} else {
			(async () => {
				let resp = await REVIEWSAPICLIENT.getReviews(0, 5);
				setReviews(resp.data);
			})();
		}
	}, [games, reviews]);

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
					<ReviewList reviews={reviews} />
				</div>
			</div>
		</div>
	);
}
