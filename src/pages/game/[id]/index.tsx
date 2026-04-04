import type { GameExt } from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Footer from "@/components/footer";
import Carousel from "@/components/game/carousel";
import GameInfo from "@/components/game/gameInfo";
import GameReviews from "@/components/game/gameReviews";
import Header from "@/components/header";
import Review from "@/components/review";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";
import { formatDate } from "@/utils/formatDate";
import { makeScrnshotURL } from "@/utils/url";

export default function Game(): AnyElem {
	const [details, setDetails] = useState<GameExt | null>(null);
	const [images, setImages] = useState<
		Array<{ id: number; src: string; alt: string; user_name: string }>
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const router = useRouter();
	const lucky = router.query.random === "1";
	const gameId =
		typeof router.query.id === "string" && !Number.isNaN(Number(router.query.id))
			? Number(router.query.id)
			: -1;

	const fetchDetails = useCallback(async () => {
		try {
			if (gameId <= 0) {
				setError(true);
				return;
			}

			const resp = await API.composite().getGameCompositeAll(gameId);
			const game = resp.data;

			if (!game || !game.id) {
				setError(true);
				return;
			}

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
				ownerBio: game.ownerBio,
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
				game.screenshots?.map((scrnShot) => ({
					id: scrnShot.id,
					src: makeScrnshotURL(scrnShot.gameId, scrnShot.id).toString(),
					alt: "",
					user_name: scrnShot.user_name,
				})) || [];

			setDetails(gameProps);
			setImages(carouselProps);
			setError(false);
		} catch (err: any) {
			if (err.response?.status === 404) {
				setError(true);
			}
		} finally {
			setLoading(false);
		}
	}, [gameId]);

	useEffect(() => {
		if (!router.isReady) return;

		setLoading(true);

		if (gameId <= 0) {
			setError(true);
			setLoading(false);
			return;
		}

		fetchDetails();
	}, [router.isReady, gameId, fetchDetails]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error || !details || details.removed) {
			return (
				<>
					<h2>404 Page Not Found!</h2>
					<p>The page you accessed doesnt exist! How about a random fangame since you're lost?</p>
					<p>
						<a
							href="#"
							onClick={async (e) => {
								e.preventDefault();
								try {
									const resp = await API.composite().getGameCompositeAll("random");
									const randomGame = resp.data;

									if (randomGame?.id) {
										router.push(`/game/${randomGame.id}?random=1`);
									}
								} catch {
									// aborted
								}
							}}
						>
							Give me a random fangame!
						</a>
					</p>
					<p>
						<Link href="/">Return home</Link>
					</p>
				</>
			)
		}
		
		return (
			<>
				{lucky && (
					<h2>
						You Randomed:{" "}
						<a
							href="#"
							onClick={async (e) => {
								e.preventDefault();
								try {
									const resp = await API.composite().getGameCompositeAll("random");
									const randomGame = resp.data;

									if (randomGame?.id) {
										router.replace(`/game/${randomGame.id}?random=1`);
									}
								} catch {
									// aborted
								}
							}}
						>
							(Reroll)
						</a>
					</h2>
				)}
				<div className="!w-full">
					<GameInfo game={details} onGameUpdated={fetchDetails} />
					<Carousel images={images} />
				</div>
				{details.ownerBio && !details.ownerBio.removed && (
					<div>
						<h2 className="clear-both">Creator's Comments:</h2>
						<Review
							id={details.ownerBio.id}
							user_id={details.ownerBio.user_id}
							game_id={details.ownerBio.game_id}
							rating={details.ownerBio.rating === null ? null : Number(details.ownerBio.rating / 10).toFixed(1)}
							difficulty={details.ownerBio.difficulty === null ? null : Number(details.ownerBio.difficulty).toFixed(1)}
							comment={details.ownerBio.comment}
							date_created={formatDate(new Date(details.ownerBio.date_created))}
							removed={details.ownerBio.removed}
							user_name={details.ownerBio.user_name}
							game_name={details.ownerBio.game_name}
							like_count={details.ownerBio.like_count}
							owner_review={details.ownerBio.owner_review}
							tags={details.ownerBio.tags}
						/>
					</div>
				)}
				<GameReviews reviews={details.reviews} />
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>{details?.name ? `${details.name} - Delicious Fruit` : "Delicious Fruit"}</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">{renderContent()}</div>
				<Footer />
			</div>
		</div>
	);
}
