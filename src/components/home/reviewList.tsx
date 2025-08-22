import Review from "../review";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";

type ReviewListProps = {
	reviews: ReviewT[];
};

export default function ReviewList(props: ReviewListProps): JSX.Element {
	return (
		<div>
			<h2>Latest Reviews</h2>
			<p className="notes">Showing 5 of 115447</p>
			{props.reviews.map((review) => {
				return (
					<Review
						key={review.id}
						author={review.user_name}
						comment={review.comment}
						rating={review.rating}
						difficulty={review.difficulty}
						tags={review.tags}
						date_created={review.date_created}
						likes={review.like_count}
						game_name={review.game_name}
						game_id={review.game_id}
					/>
				);
			})}
			<a className="standalone" href="/">
				Read more reviews!
			</a>
		</div>
	);
}

