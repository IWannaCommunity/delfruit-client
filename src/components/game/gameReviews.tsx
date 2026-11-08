import Review from "@/components/review";
import { useState, useCallback, useEffect } from "react";
import WriteReview from "@/components/game/writeReview";
import { API } from "@/utils/api";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import { useRouter } from "next/router";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";
import type { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";

type GameReviewsProp = {
	reviews: ReviewT[];
	ownerId: number;
	ownerBio: ReviewT | null;
	onOwnerReviewUpdated: () => Promise<void>;
};

export default function GameReviews(props: GameReviewsProp): AnyElem {
	const [session] = useSessionContext();
	const [userReview, setUserReview] = useState<ReviewT | null>(
		props.ownerBio && Number(props.ownerBio.user_id) === Number(session.user_id)
			? props.ownerBio
			: null
	);
	const [reviews, setReviews] = useState<ReviewT[]>(props.reviews);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(props.reviews.length === 5);
	const [initialized, setInitialized] = useState(props.reviews.length > 0);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const router = useRouter();
	const id = Number(router.query.id);
	const isGameOwner = session.user_id === props.ownerId;

	const fetchUserReview = useCallback(async () => {
		if (!router.isReady || !session.active || !session.user_id || isGameOwner) {
			return;
		}

    try {
        const res = await API.games().getGameReviews(
					id, // id
					session.user_id, // user id
					false, // include owner review
					true, // text reviews first
					0, // page number
					1, // limit
        );

        const r = res.data?.[0];

        if (!r) {
					setUserReview(null);
					return;
        }

        setUserReview({
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
        });
    } catch {
      setUserReview(null);
    }
	}, [id, router.isReady, session.active, session.user_id, isGameOwner]);

	const fetchReviews = useCallback(
		async (requestedPage: number): Promise<ReviewT[]> => {
			const res = await API.games().getGameReviews(
				id, // id
				undefined, // user id
				false, // include owner review
				true, // text reviews first
				requestedPage, // page number
				5, // limit
			);

			const newData: ReviewT[] = (res.data ?? []).map((r: any) => ({
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
		if (!router.isReady || isLoadingMore || !hasMore) return;

		setIsLoadingMore(true);

		try {
			const nextPage = page + 1;
			const moreReviews = await fetchReviews(nextPage);

			setHasMore(moreReviews.length === 5);

			if (moreReviews.length > 0) {
				setReviews((prev) =>
					dedupeArray([...prev, ...moreReviews], (r) => r.id)
				);
				setPage(nextPage);
				setInitialized(true);
			}
		} finally {
			setIsLoadingMore(false);
		}
	}, [fetchReviews, page, router.isReady, isLoadingMore, hasMore]);

	const loaderRef = useInfiniteScroll<HTMLDivElement>(
		() => { if (hasMore) loadMore(); },
		{ enabled: initialized }
	);

	const otherReviews = reviews.filter(
		(review) => review.id !== userReview?.id
	);

	useEffect(() => {
    fetchUserReview();
	}, [fetchUserReview]);

	useEffect(() => {
		if (props.ownerBio && isGameOwner) {
			setUserReview(props.ownerBio);
		}
	}, [props.ownerBio, session.user_id, isGameOwner]);

	return (
		<div>
			<h2 className="clear-both">
				{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}:
				{hasMore && (
					<span className="ml-1 font-normal text-base">
						(scroll down for more)
					</span>
				)}
			</h2>

			{session.active && (
				<WriteReview
					existingReview={userReview}
					onReviewUpdated={async () => {
						if (userReview?.owner_review) {
							console.log("got here");
							await props.onOwnerReviewUpdated();
							return;
						}
						const fresh = await fetchReviews(0);
						setReviews(fresh);
						setPage(0);
						setHasMore(fresh.length === 5);
						setInitialized(true);

						await fetchUserReview();
					}}
				/>
			)}

			{/* Review List */}
			<div id="reviews">
				{userReview && !userReview.owner_review && (
					<Review
						key={userReview.id}
						id={userReview.id}
						user_id={userReview.user_id}
						game_id={userReview.game_id}
						rating={userReview.rating}
						difficulty={userReview.difficulty}
						comment={userReview.comment}
						date_created={userReview.date_created}
						removed={userReview.removed}
						user_name={userReview.user_name}
						game_name={userReview.game_name}
						like_count={userReview.like_count}
						owner_review={userReview.owner_review}
						tags={userReview.tags}
					/>
				)}

				{otherReviews.map((review) => (
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
				))}
			</div>

			{/* Infinite scroll trigger */}
			{hasMore ? (
				<div ref={loaderRef} className="flex justify-center items-center h-16">
					{isLoadingMore && (
						<div className="animate-pulse text-blue-500">Loading...</div>
					)}
				</div>
			) : (
				<div ref={loaderRef} className="flex justify-center items-center h-16">
					<span>No more results.</span>
				</div>
			)}
		</div>
	);
}