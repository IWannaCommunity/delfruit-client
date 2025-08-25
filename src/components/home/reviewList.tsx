import Review from "../review";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import Link from "next/link";

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
			<Link className="standalone" href="/">
				Read more reviews!
			</Link>
		</div>
	);
}

