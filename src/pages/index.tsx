import Head from "next/head";
import Header from "../components/header";
import News from "../components/home/news";
import GameList from "../components/home/gameList";
import ReviewList from "../components/home/reviewList";
import { CompositeApi, ReviewsApi, Review } from "delfruit-swagger-cg-sdk";
import React, { useEffect, useState } from "react";
import { GameProps } from "../components/game";
import type { Config } from "../utils/config";
import { NextPage } from "next";
import { formatDate } from "../utils/formatDate";

const CFG: Config = require("../config.json");

const COMPOSITE_API_CLIENT = new CompositeApi(undefined, CFG.apiURL.toString());
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
				COMPOSITE_API_CLIENT.getGamesWithRatings(
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
					date_created: game.date_created ? formatDate(new Date(game.date_created)) : null,
					rating: (game.ratings.rating === -1) ? -1 : Number(game.ratings.rating/10).toFixed(1),
					difficulty: (game.ratings.difficulty === -1) ? -1 : Number(game.ratings.difficulty).toFixed(1),
					rating_count: game.rating_count,
				}));
				setGames(gameProps);
			} else {
				setGamesError("Failed to load games.");
			}
			setLoadingGames(false);

			// Reviews result
			if (results[1].status === "fulfilled") {
				const resp = results[1].value;
				const reviewProps: ReviewProps[] = resp.data.map((review) => ({
					id: review.id,
					user_id: review.user_id,
					game_id: review.game_id,
					rating: (review.rating === -1) ? -1 : Number(review.rating/10).toFixed(1),
					difficulty: (review.difficulty === -1) ? -1 : Number(review.difficulty),
					comment: review.comment,
					date_created: review.date_created ? formatDate(new Date(review.date_created)) : null,
					removed: review.removed,
					user_name: review.user_name,
					game_name: review.game_name,
					like_count: review.like_count,
					owner_review: review.owner_review === 1
				}));
				setReviews(reviewProps);
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

