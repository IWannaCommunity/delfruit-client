import Review from "@/components/review";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { ReviewsApi } from "delfruit-swagger-cg-sdk";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { AnyElem } from "@/utils/element";
import { Config } from "@/utils/config";

const CFG: Config = require("@/config.json");
const REVIEWS_API_CLIENT = new ReviewsApi(undefined, CFG.apiURL.toString());

type ReviewListProps = {
	page: number;
	limit: number;
};

export default function ReviewList(props: ReviewListProps): AnyElem {
	const [reviews, setReviews] = useState<ReviewT[]>([]);

	const fetchReviews = useCallback(async () => {
		const resp = await REVIEWS_API_CLIENT.getReviews(
			undefined, // gameID
			undefined, // userID
			undefined, // ID
			props.page, // page
			props.limit // limit
		);
		return resp.data;
	}, [props.limit, props.page]);

	useEffect(() => {
		(async () => {
			const newReviews = await fetchReviews();

			const reviewProps: ReviewT[] = newReviews.map((review) => ({
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
			}));
			setReviews(reviewProps);
		})();
	}, [fetchReviews]);

	return (
		<>
			{reviews.map((review) => {
				return (
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
				);
			})}
		</>
	);
}
