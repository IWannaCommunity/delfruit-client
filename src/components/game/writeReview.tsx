import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {getRatingDescription, getDifficultyDescription} from "@/utils/ratingHelpers"

export default function GameReviews(): JSX.Element {

	const [showWrite, setShowWrite] = useState(false);
	const [rating, setRating] = useState(-0.1);
	const [difficulty, setDifficulty] = useState(-1);
	
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
					/>
					<br />
					
					{/* Tags */}
					<span>
						Tags (separate with spaces, 30 characters per tag, max of 10):
					</span>
					<br />
					<input className="w-full" type="text" name="tags" id="tags" />
					<span className="tags_alert"/>
					<br />
					<input type="button" id="update_button" value="Update My Review" />
					<span className="ajax_alert !hidden"/>
				</div>
			)}
		</>
	);
}