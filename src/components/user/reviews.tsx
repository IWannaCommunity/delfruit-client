// Feel free to replace any/all of this

import { UsersApi } from "delfruit-swagger-cg-sdk";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { formatDate } from "@/utils/formatDate";
import Review from "@/components/review";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT: UsersApi = new UsersApi(undefined, CFG.apiURL.toString());

type Review = {
	id: number;
	user_name: string;
	game_id: number;
	game_name: string;
	comment: string;
	date_created: string;
	difficulty: number | null;
	rating: number | null;
	like_count: number;
	owner_review: boolean;
	tags: [];
};

export default function Reviews(): JSX.Element {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	
	const fetchReviews = useCallback(
		async (requestedPage: number): Promise<Review[]> => {
			const res = await USERS_API_CLIENT.getUsersReviews(
				userID, // id
				requestedPage, // page number
				10, // limit
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
		},[]
	);
	
	useEffect(() => {
		if (!router.isReady) return;

		let isCancelled = false;

		const fetchAndSet = async () => {
			const firstPage = await fetchReviews(0);
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
	}, [router.isReady, fetchReviews]);

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
	
	return(
		<div className="px-[1.5em]">
			<p className="text-[#222222]">{reviews.length} Reviews</p>
			{[...reviews].map((review) => {
				return (
					<Review
						key={review.id}
						user_name={review.user_name}
						comment={review.comment}
						rating={review.rating}
						difficulty={review.difficulty}
						tags={review.tags}
						date_created={review.date_created}
						like_count={review.like_count}
						game_name={review.game_name}
						game_id={review.game_id}
					/>
				);
			})}
			{/* Infinite scroll trigger */}
			{loaderRef && <div ref={loaderRef} className="h-40" />}
		</div>
	);
}