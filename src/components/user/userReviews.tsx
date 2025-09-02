import { UsersApi, Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { formatDate } from "@/utils/formatDate";
import Review from "@/components/review";
import { dedupeArray } from "@/utils/dedupeArray";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT: UsersApi = new UsersApi(undefined, CFG.apiURL.toString());

export default function UserReviews(): JSX.Element {
	const [reviews, setReviews] = useState<ReviewT[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	
	const fetchReviews = useCallback(
		async (requestedPage: number, userID: number): Promise<ReviewT[]> => {
			const res = await USERS_API_CLIENT.getUsersReviews(
				userID, // id
				requestedPage, // page number
				10, // limit
			);

			const newData: ReviewT[] = (res.data ?? []).map((r: any) => ({
				id: Number(r.id),
				game_id: Number(r.game_id),
				user_id: Number(r.user_id),
				user_name: r.user_name,
				game_name: r.game_name,
				date_created: formatDate(new Date(r.date_created)),
				comment: r.comment,
				rating: (r.rating === null) ? null : Number(r.rating/10).toFixed(1),
				difficulty: (r.difficulty === null) ? null : Number(r.difficulty),
				like_count: Number(r.like_count),
				owner_review: r.owner_review === 1,
				tags: r.tags,
				removed: r.removed
			}));

			return newData;
		},[]
	);
	
	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		let isCancelled = false;

		const fetchAndSet = async () => {
			const firstPage = await fetchReviews(0, id);
			if (!isCancelled) {
				setReviews(firstPage);
				setPage(0);
				setHasMore(firstPage.length > 0);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup
		};
	}, [router.isReady, fetchReviews, router.query.id]);

	const loadMore = async () => {
		const nextPage = page + 1;
		const moreReviews = await fetchReviews(nextPage, Number(router.query.id));

		if (moreReviews.length === 0) {
			setHasMore(false);
			return;
		}

		setReviews((prev) => dedupeArray([...prev, ...moreReviews], (r) => r.id));
		setPage(nextPage);
	};
	
	const loaderRef = useInfiniteScroll<HTMLDivElement>(() => {
		if (hasMore) loadMore();
	});
	
	return(
		<div className="px-[1.5em]">
			<p className="text-[#222222]">{reviews.length} Reviews</p>
			{reviews.map((review) => {
				return (
					<Review
						key={review.id}
						id={review.id}
						user_name={review.user_name}
						user_id={review.user_id}
						comment={review.comment}
						rating={review.rating}
						difficulty={review.difficulty}
						tags={review.tags}
						date_created={review.date_created}
						like_count={review.like_count}
						game_name={review.game_name}
						game_id={review.game_id}
						removed={review.removed}
						owner_review={review.owner_review}
					/>
				);
			})}
			{/* Infinite scroll trigger */}
			{loaderRef && hasMore ? (
				<div ref={loaderRef} className="h-10" />
			) : (
				<span>No more reviews.</span>
			)}
		</div>
	);
}