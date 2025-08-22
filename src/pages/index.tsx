import Head from "next/head";
import Header from "../components/header";
import News from "../components/home/news";
import GameList from "../components/home/gameList";
import ReviewList from "../components/home/reviewList";
import { GamesApi, ReviewsApi, Review } from "delfruit-swagger-cg-sdk";
import React, { useEffect, useState } from "react";
import { GameProps } from "../components/game";
import type { Config } from "../utils/config";
import { NextPage } from "next";

const CFG: Config = require("../config.json");

const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());
const REVIEWS_API_CLIENT = new ReviewsApi(undefined, CFG.apiURL.toString());

export default function Home(): NextPage {
	const [games, setGames] = useState<GameProps[]>([]);
	const [reviews, setReviews] = useState<Review[]>([]);

	const [loadingGames, setLoadingGames] = useState(true);
	const [loadingReviews, setLoadingReviews] = useState(true);

	const [gamesError, setGamesError] = useState<string | null>(null);
	const [reviewsError, setReviewsError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const results = await Promise.allSettled([
				GAMES_API_CLIENT.getGames(
					undefined,
					undefined,
					false,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					new Date(Date.now()), // createdTo
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					0,
					25,
					"date_created",
					"desc",
				),
				REVIEWS_API_CLIENT.getReviews(0, 5),
			]);

			// Games result
			if (results[0].status === "fulfilled") {
				const resp = results[0].value;
				const gameProps: GameProps[] = resp.data.map((game) => ({
					name: game.name,
					id: game.id,
					date_created: game.date_created,
					rating: Number(game.rating),
					difficulty: Number(game.difficulty),
					rating_count: game.rating_count,
				}));
				setGames(gameProps);
			} else {
				setGamesError("Failed to load games.");
			}
			setLoadingGames(false);

			// Reviews result
			if (results[1].status === "fulfilled") {
				setReviews(results[1].value.data);
			} else {
				setReviewsError("Failed to load reviews.");
			}
			setLoadingReviews(false);
		};

		fetchData();
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

					{/* Games */}
					{loadingGames ? (
						<p>Loading games...</p>
					) : gamesError ? (
						<p className="error">{gamesError}</p>
					) : (
						<GameList games={games} />
					)}

					{/* Reviews */}
					{loadingReviews ? (
						<p>Loading reviews...</p>
					) : reviewsError ? (
						<p className="error">{reviewsError}</p>
					) : (
						<ReviewList reviews={reviews} />
					)}
				</div>
			</div>
		</div>
	);
}

