import Review from "@/components/review";
import { useState, useEffect, useCallback } from "react";
import WriteReview from "@/components/game/writeReview"
import { GamesApi } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/router";
import { useInfiniteScroll } from "@/utils/infiniteScroll";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

type GameReviewsProp = {
	reviews: Review[];
};

type Review = {
	id: number;
	user_id: number;
	user_name: string;
	game_id: number;
	game_name: string;
	comment: string;
	date_created: Date | null;
	removed: boolean;
	difficulty: number | null;
	rating: number | null;
	like_count: number;
	owner_review: boolean;
	tags: [];
};

export default function GameReviews(props: GameReviewsProp): JSX.Element {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	const id = Number(router.query.id);

	const fetchReviews = useCallback(
			async (requestedPage: number): Promise<Review[]> => {
				const res = await GAMES_API_CLIENT.getGameReviews(
					id, // id
					undefined,
					true,
					true,
					requestedPage, // page number
					5, // limit
				);
	
				const newData: Review[] = (res.data ?? []).map((r: any) => ({
					id: Number(r.id),
					game_id: Number(r.game_id),
					user_name: r.user_name,
					game_name: r.game_name,
					date_created: formatDate(new Date(r.date_created)),
					comment: r.comment,
					rating: (r.rating === null) ? null : Number(r.rating/10).toFixed(1),
					difficulty: (r.difficulty === null) ? null : Number(r.difficulty),
					like_count: Number(r.like_count),
					owner_review: r.owner_review === 1,
					tags: r.tags
				}));
	
				return newData;
			},[id]
		);
		
		useEffect(() => {
			if (!router.isReady) return;

			setReviews(props.reviews);
	
			let isCancelled = false;
	
			const fetchAndSet = async () => {
				const firstPage = await fetchReviews(1);
				if (!isCancelled) {
					setReviews(firstPage);
					setPage(1);
					setHasMore(firstPage.length > 0);
				}
			};
	
			fetchAndSet();
	
			return () => {
				isCancelled = true; // cleanup
			};
		}, [router.isReady, fetchReviews, props.reviews]);
	
		const loadMore = async () => {
			const nextPage = page + 1;
			const moreReviews = await fetchReviews(nextPage);
	
			if (moreReviews.length === 0) {
				setHasMore(false);
				return;
			}
	
			setReviews((prev) => [...prev, ...moreReviews]);
			setPage(nextPage);
		};
		
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
			{loaderRef && <div ref={loaderRef} className="h-10" />}
		</div>
	);
}
