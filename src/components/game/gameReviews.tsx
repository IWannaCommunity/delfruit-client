import Review from "@/components/review";
import { useState, useCallback } from "react";
import WriteReview from "@/components/game/writeReview";
import { GamesApi, Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/router";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";
import type { AnyElem } from "@/utils/element";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

type GameReviewsProp = {
	reviews: ReviewT[];
};

export default function GameReviews(props: GameReviewsProp): AnyElem {
	const [reviews, setReviews] = useState<ReviewT[]>(props.reviews);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	const id = Number(router.query.id);

	const fetchReviews = useCallback(
		async (requestedPage: number): Promise<ReadonlyArray<ReviewT>> => {
			const res = await GAMES_API_CLIENT.getGameReviews(
				id, // id
				undefined,
				true,
				true,
				requestedPage, // page number
				5, // limit
			);

			const newData: ReadonlyArray<ReviewT> = (res.data ?? []).map((r: any) => ({
				id: Number(r.id),
				user_id: Number(r.user_id),
				game_id: null,
				user_name: r.user_name,
				game_name: r.game_name,
				date_created: formatDate(new Date(r.date_created)),
				removed: r.removed,
				comment: r.comment,
				rating: r.rating === null ? null : Number(r.rating / 10).toFixed(1),
				difficulty: r.difficulty === null ? null : Number(r.difficulty),
				like_count: Number(r.like_count),
				owner_review: r.owner_review === 1,
				tags: r.tags,
			}));

			return newData;
		},
		[id],
	);

	const loadMore = useCallback(async () => {
		if (!router.isReady) return;

		const nextPage = page + 1;
		const moreReviews = await fetchReviews(nextPage);

		if (moreReviews.length === 0) {
			setHasMore(false);
			return;
		}

		setReviews((prev) => dedupeArray([...prev, ...moreReviews], (r) => r.id));
		setPage(nextPage);
	}, [fetchReviews, page, router.isReady]);

	const loaderRef = useInfiniteScroll<HTMLDivElement>(() => {
		if (hasMore) loadMore();
	});

	return (
		<div>
			<h2 className="clear-both">{reviews.length} Reviews:</h2>

			<WriteReview />

			{/* Review List */}
			<div id="reviews">
				{reviews.map((review) => {
					return (
						<Review
							key={review.id}
							id={review.id}
							user_id={review.user_id}
							game_id={review.game_id}
							rating={review.rating}
							difficulty={review.difficulty}
							comment={review.comment}
							date_created={review.date_created}
							removed={review.removed}
							user_name={review.user_name}
							game_name={review.game_name}
							like_count={review.like_count}
							owner_review={review.owner_review}
							tags={review.tags}
						/>
					);
				})}
			</div>
			{/* Infinite scroll trigger */}
			{loaderRef && hasMore ? (
				<div ref={loaderRef} className="h-10" />
			) : (
				<span>No more reviews.</span>
			)}
		</div>
	);
}
