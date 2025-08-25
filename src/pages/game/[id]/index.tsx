import Head from "next/head";
import Header from "@/components/header";
import GameInfo from "@/components/game/gameInfo";
import Carousel from "@/components/game/carousel";
import GameReviews from "@/components/game/gameReviews";
import { CompositeApi, GameExt } from "delfruit-swagger-cg-sdk";
import { Config } from "@/utils/config";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { formatDate } from "@/utils/formatDate";

const CFG: Config = require("@/config.json");

const images=[
	{"src": "/images/v2/ShowcasedImage-Test.png", "alt": "test"},
	{"src": "/images/v2/screenshot2.png", "alt": "test"},
	{"src": "/images/v2/screenshot3.png", "alt": "test"},
	{"src": "/images/v2/screenshot4.png", "alt": "test"}
];

const APICLIENT = new CompositeApi(undefined, CFG.apiURL.toString());

export default function Game(): NextPage {
	const [details, setDetails] = useState<GameExt>(null);

	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (!id) { return; }
		
		(async () => {
			const resp = await APICLIENT.getGameCompositeAll(id);
			const game = resp.data;
			const gameProps: GameExt = {
				id: game.id,
				name: game.name,
				url: game.url,
				author: game.author,
				collab: game.collab,
				removed: game.removed,
				owner_id: game.owner_id,
				dateCreated: game.dateCreated ? formatDate(new Date(game.dateCreated)) : null,
				rating: (game.ratings.rating === -1) ? "N/A" : Number(game.ratings.rating/10).toFixed(1),
				difficulty: (game.ratings.difficulty === -1) ? "N/A" : Number(game.ratings.difficulty).toFixed(1),
				urlSpdrn: game.urlSpdrn,
				tags: game.tags,
				
				reviews: game.reviews?.map((review) => ({
					id: review.id,
					user_id: review.user_id,
					game_id: review.game_id,
					rating: (review.rating === -1) ? "N/A" : Number(review.rating/10).toFixed(1),
					difficulty: (review.difficulty === -1) ? "N/A" : Number(review.difficulty),
					comment: review.comment,
					date_created: formatDate(new Date(review.date_created)),
					removed: review.removed,
					user_name: review.user_name,
					game_name: review.game_name,
					like_count: review.like_count,
					owner_review: review.owner_review === 1,
					tags: review.tags
				})) || []
			};
			setDetails(gameProps);
		})();
	}, [id]);

	if (!details) { return <></>; }
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<div className="!w-full">
						<GameInfo game={details} />
						<Carousel images={images}/>
					</div>
					<GameReviews reviews={details.reviews} />
				</div>
			</div>
		</div>
	);
}
