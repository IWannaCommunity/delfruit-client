import Whitespace from "../whitespace";
import Review from "../review";

export default function ReviewList(): JSX.Element {
	return (
		<div>
			<h2>Latest Reviews</h2>
			<p className="notes">Showing 5 of 115447</p>
			<Review />
			<Review />
			<Review />
			<Review />
			<Review />
			<a className="standalone" href="/">Read more reviews!</a>
		</div>
	);
}