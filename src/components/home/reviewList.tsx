import Review from "@/components/review";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { API } from "@/utils/api";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { getCachedReviewCount } from "@/utils/reviewCache";

type ReviewListProps = {
	page: number;
	limit: number;
};

export default function ReviewList(props: ReviewListProps): JSX.Element {
	const [reviews, setReviews] = useState<ReviewT[]>([]);
	const [count, setCount] = useState<number>(0);

	const [loading, setLoading] = useState(false);
	const [countLoading, setCountLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setCountLoading(true);

		const fetchData = async () => {
			const results = await Promise.allSettled([
				API.reviews().getReviews(
					undefined, // gameID
					undefined, // userID
					undefined, // ID
					props.page, // page
					props.limit, // limit
					true, // textReviewsFirst
					true, // includeOwnerReview
					false, // removed
				),
				getCachedReviewCount()
			]);

			// Reviews result
			if (results[0].status === "fulfilled") {
				const resp = results[0].value;
				const reviewProps: ReviewT[] = resp.data.map((review) => ({
					id: review.id,
					user_id: review.user_id,
					game_id: review.game_id,
					rating:
						review.rating === null ? null : Number(review.rating / 10).toFixed(1),
					difficulty:
						review.difficulty === null ? null : Number(review.difficulty),
					comment: review.comment,
					date_created: review.date_created
						? formatDate(new Date(review.date_created))
						: null,
					removed: review.removed,
					user_name: review.user_name,
					game_name: review.game_name,
					like_count: review.like_count,
					owner_review: review.owner_review === 1,
					tags: review.tags,
				}));

				setReviews(reviewProps);
				setError(null);
			} else {
				setError("Failed to load reviews.");
			}

			setLoading(false);

			// Count result
			if (results[1].status === "fulfilled") {
				setCount(results[1].value);
			}

			setCountLoading(false);
		};
		fetchData();
	}, [props.limit, props.page]);

	return (
		<div>
			<h2>Latest Reviews</h2>

			{!countLoading && (
				<p className="notes">
					Showing {props.limit} of {count}
				</p>
			)}

			{loading ? (
				<span>Loading...</span>
			) : error ? (
				<span className="text-red-600">{error}</span>
			) : (
				reviews.map((review) => (
					<Review
						key={review.id}
						id={review.id}
						user_id={review.user_id}
						user_name={review.user_name}
						comment={review.comment}
						rating={review.rating}
						difficulty={review.difficulty}
						tags={review.tags}
						date_created={review.date_created}
						like_count={review.like_count}
						game_name={review.game_name}
						game_id={review.game_id}
						owner_review={review.owner_review}
						removed={review.removed}
					/>
				))
			)}
		</div>
	);
}