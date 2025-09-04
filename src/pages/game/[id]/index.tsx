import Head from "next/head";
import Header from "@/components/header";
import GameInfo from "@/components/game/gameInfo";
import Carousel from "@/components/game/carousel";
import GameReviews from "@/components/game/gameReviews";
import { CompositeApi, GameExt } from "delfruit-swagger-cg-sdk";
import { Config } from "@/utils/config";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/formatDate";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";

const CFG: Config = require("@/config.json");

const APICLIENT = new CompositeApi(undefined, CFG.apiURL.toString());

function makeScrnshotURL(gameId: number, screenshotId: number): URL {
	const screenshotIdAsUInt32: number = screenshotId >>> 0;

	return new URL(
		`${CFG.screenshotURLPrefix.toString()}/${gameId}_${screenshotIdAsUInt32
			.toString(16)
			.padStart(8, "0")}`,
	);
}

export default function Game(): AnyElem {
	const [details, setDetails] = useState<GameExt>(null);
	const [images, setImages] = useState<
		Array<{ id: number, src: string; alt: string, user_name: string }>
	>([]);

	const router = useRouter();
	const id = Number(router.query.id);

	useEffect(() => {
		if (!id) {
			return;
		}

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
				dateCreated: game.dateCreated
					? formatDate(new Date(game.dateCreated))
					: null,
				rating:
					game.rating === null ? null : Number(game.rating / 10).toFixed(1),
				difficulty:
					game.difficulty === null ? null : Number(game.difficulty).toFixed(1),
				urlSpdrn: game.urlSpdrn,
				tags: game.tags,

				reviews:
					game.reviews?.map((review) => ({
						id: review.id,
						user_id: review.user_id,
						game_id: null,
						rating:
							review.rating === null
								? null
								: Number(review.rating / 10).toFixed(1),
						difficulty:
							review.difficulty === null ? null : Number(review.difficulty),
						comment: review.comment,
						date_created: formatDate(new Date(review.date_created)),
						removed: review.removed,
						user_name: review.user_name,
						game_name: review.game_name,
						like_count: review.like_count,
						owner_review: review.owner_review === 1,
						tags: review.tags,
					})) || [],
			};

			const carouselProps =
				game.screenshots.map((scrnShot) => ({
					id: scrnShot.id,
					src: makeScrnshotURL(scrnShot.gameId, scrnShot.id).toString(),
					alt: "",
					user_name: scrnShot.user_name
				})) || [];
			setDetails(gameProps);
			setImages(carouselProps);
		})();
	}, [id]);

	if (!details) {
		return <></>;
	}

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
						<Carousel images={images} />
					</div>
					<GameReviews reviews={details.reviews} />
				</div>
				<Footer />
			</div>
		</div>
	);
}
