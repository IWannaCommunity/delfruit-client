import Whitespace from "../whitespace";
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
						author={review.user_name}
						comment={review.comment}
						rating={review.rating}
						difficulty={review.difficulty}
						tags={review.tags}
						dateCreated={review.dateCreated}
						likes={review.like_count}
					/>
				);
			})}
			<a className="standalone" href="/">
				Read more reviews!
			</a>
		</div>
	);
}

