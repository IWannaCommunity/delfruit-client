import Image from "next/image";
import Review from "../review";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import React from "react";

type GameReviewsProp = {
	reviews: ReviewT[];
};

export default function GameReviews(props: GameReviewsProp): JSX.Element {
	return (
		<div>
			<h2 className="!clear-both">{props.reviews.length} Reviews:</h2>
			<div id="myreviewtoggle">
				<Image
					src="/images/pencil.png"
					width={24}
					height={24}
					alt="Write Review"
				/>
				<span className="!leading-[26px]">Write a Review</span>
			</div>
			<div id="myreview" className="!hidden">
				<span className="!font-bold">My Review</span>
				<p> </p>
				<ul>
					<li>
						<span>Make sure to follow the </span>
						<a href="/">rules</a>
						<span> for reviewing games when writing your review.</span>
					</li>
					<li>Make sure to properly tag your spoilers with the spoiler tag:</li>
					<li className="!list-none">
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
				<p></p>
				<div>
					<span>My Rating: </span>
					<span id="ratingSpan">None</span>
				</div>
				<div
					className="!p-[0] !ml-[0.5em] !mr-[0.5em] !mb-[1em] ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"
					id="rating"
				>
					<span
						className="ui-slider-handle ui-state-default ui-corner-all !left-[0%]"
						tabIndex={0}
					></span>
				</div>
				<div>
					<span>My Difficulty: </span>
					<span id="diffSpan">None</span>
				</div>
				<div
					className="!p-[0] !ml-[0.5em] !mr-[0.5em] ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"
					id="difficulty"
				>
					<span
						className="ui-slider-handle ui-state-default ui-corner-all !left-[0%]"
						tabIndex={0}
					/>
				</div>
				<br />
				<textarea
					maxLength="50000"
					id="mycomment"
					placeholder="Tell everyone what you thought of the game!"
				></textarea>
				<br />
				<span>
					{" "}
					Tags (separate with spaces, 30 characters per tag, max of 10):
				</span>
				<br />
				<input className="!w-full" type="text" name="tags" id="tags" />
				<span className="tags_alert"></span>
				<br />
				<br />
				<input type="button" id="update_button" value="Update My Review" />
				<span className="ajax_alert !hidden"></span>
			</div>
			<div id="reviews">
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
			</div>
		</div>
	);
}
