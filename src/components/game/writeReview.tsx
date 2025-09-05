import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRatingDescription, getDifficultyDescription } from "@/utils/ratingHelpers"
import { ReviewsApi, Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { useRouter } from "next/router";
import { useSessionContext } from "@/utils/hooks";

const CFG: Config = require("@/config.json");
const REVIEWS_API_CLIENT = new ReviewsApi(undefined, CFG.apiURL.toString());

type WriteReviewProps = {
  onReviewUpdated: () => void;
	existingReview?: ReviewT | null;
};

export default function GameReviews({ onReviewUpdated, existingReview }: WriteReviewProps): JSX.Element {

	const [showWrite, setShowWrite] = useState(false);
	const [rating, setRating] = useState(existingReview?.rating ?? -0.1);
	const [difficulty, setDifficulty] = useState(existingReview?.difficulty ?? -1);
	const [comment, setComment] = useState(existingReview?.comment ?? "");
	const [tags, setTags] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [session] = useSessionContext();

	const router = useRouter();
	const gameId = Number(router.query.id);

	async function handleSubmit() {
		setLoading(true);
		setError(null);

		try {
			const body: ReviewT = {
				rating: rating >= 0 ? rating : undefined,
				difficulty: difficulty >= 0 ? difficulty : undefined,
				comment
			};

			const token = session.token;

			await REVIEWS_API_CLIENT.putGameReview(body, `Bearer ${token}`, gameId);
			
			onReviewUpdated();
			setShowWrite(false);
		} catch (err: any) {
			setError("Failed to submit review. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (existingReview) {
			setRating(existingReview.rating ?? -0.1);
			setDifficulty(existingReview.difficulty ?? -1);
			setComment(existingReview.comment ?? "");
		}
	}, [existingReview]);

	return(
		<>
			{/* Write Review Button */}
			{!showWrite && (
				<div 
					id="myreviewtoggle"
					onClick={() => setShowWrite(true)}
				>
					<Image
						src="/images/pencil.png"
						width={24}
						height={24}
						alt="Write Review"
					/>
					<span className="leading-[26px]">Write a Review</span>
				</div>
			)}
			
			{/* Hide Button */}
			{showWrite && (
				<button
				type="button"
					onClick={() => setShowWrite(false)}
					className="text-sm text-gray-600 hover:text-black"
				>
					Hide
				</button>
			)}
			
			{/* Review Rules */}
			{showWrite && (
				<div id="myreview" className="mt-4">
					<span className="font-bold">My Review</span>
					<ul>
						<li>
							<span>Make sure to follow the </span>
							<Link href="/">rules</Link>
							<span> for reviewing games when writing your review.</span>
						</li>
						<li>Make sure to properly tag your spoilers with the spoiler tag:</li>
						<li className="list-none">
							<ul>
								<li>'[spoiler]This game has apples![spoiler]'</li>
							</ul>
						</li>
						<li>
							Please do not intentionally give games a review that would be
							considered sarcastic, troll, or off-topic. (You are allowed to be
							funny with your comments.)
						</li>
						<li>
							When reviewing a game please try to point out what you
							liked/disliked about it and how it could be improved.
						</li>
						<li>
							When rating a game, we ask that you have cleared it first (or at
							least given it a fair attempt) before reviewing.
						</li>
					</ul>
					
					{/* Rating Slider */}
					<div className="mt-4">
						<span className="font-medium">My Rating: </span>
						<span id="ratingSpan">{rating !== -0.1 ? rating : "None"} {getRatingDescription(rating)}</span>
					</div>
					<input
						type="range"
						min={-0.1}
						max={10}
						step={0.1}
						defaultValue={-0.1}
						onChange={(e) => setRating(parseFloat(e.target.value))}
						id="rating"
						className="review-slider ui-slider-horizontal"
					/>

					{/* Difficulty Slider */}
					<div className="mt-4">
						<span className="font-medium">My Difficulty: </span>
						<span id="diffSpan">{difficulty !== -1 ? difficulty : "None"} {getDifficultyDescription(difficulty)}</span>
					</div>
					<input
						type="range"
						min={-1}
						max={100}
						step={1}
						defaultValue={-1}
						onChange={(e) => setDifficulty(parseInt(e.target.value))}
						id="difficulty"
						className="review-slider ui-slider-horizontal mb-10"
					/>
					
					{/* Comment box */}
					<textarea
						maxLength={50000}
						id="mycomment"
						placeholder="Tell everyone what you thought of the game!"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<br />
					
					{/* Tags */}
					<span>
						Tags (separate with spaces, 30 characters per tag, max of 10):
					</span>
					<br />
					<input 
						className="w-full"
						type="text"
						name="tags"
						id="tags"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
					<span className="tags_alert"/>
					<br />
					<input 
						type="button"
						id="update_button"
						value={existingReview ? "Update Review" : "Submit Review"}
						disabled={loading}
						onClick={handleSubmit}
					/>
					{error && <span className="text-red-600"> {error}</span>}
				</div>
			)}
		</>
	);
}