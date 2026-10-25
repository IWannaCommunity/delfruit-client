import type { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Captcha from "@/components/captcha";
import { API } from "@/utils/api";
import { useSessionContext } from "@/utils/hooks";
import {
	getDifficultyDescription,
	getRatingDescription,
} from "@/utils/ratingHelpers";

type WriteReviewProps = {
	onReviewUpdated: () => void;
	existingReview: ReviewT | null;
};

export default function WriteReview({
	onReviewUpdated,
	existingReview,
}: WriteReviewProps): JSX.Element {
	const [showWrite, setShowWrite] = useState(false);
	const [rating, setRating] = useState(existingReview?.rating ?? -0.1);
	const [difficulty, setDifficulty] = useState(
		existingReview?.difficulty ?? -1,
	);
	const [comment, setComment] = useState(existingReview?.comment ?? "");
	const [tags, setTags] = useState("");
	const [loading, setLoading] = useState(false);
	const [captchaToken, setCaptchaToken] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [session] = useSessionContext();

	const router = useRouter();
	const gameId = Number(router.query.id);

	function isReviewEmpty() {
		return rating < 0 && difficulty < 0 && comment.trim() === "" && tags.trim() === "";
	}
	
	async function getOrCreateTagId(tag: string): Promise<number> {
		const response = await API.tags().getTags(tag);
		const existingTag = response.data.find(
			(item: {name?: string }) =>
				item.name?.toLowerCase() === tag.toLowerCase()
		);

		if (existingTag) {
			return existingTag.id;
		}

		const tagResponse = await API.tags().postTag({
			name: tag
		});

		const createdTag = tagResponse.data as {
			id?: number;
			name?: string;
		};

		if (typeof createdTag?.id !== "number") {
			throw new Error(`Failed to create tag: ${tag}`)
		}

		return createdTag.id;
	}

	const handleSubmit = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			if (isReviewEmpty()) {
				setError(
					"Please provide at least a rating, difficulty, comment, or tag before submitting.",
				);
				setLoading(false);
				return;
			}

			const tagNames = [...new Set(tags.trim().split(" ").filter(Boolean))];

			if (tagNames.length > 10) {
				setError("You can only add a maximum of 10 tags.");
				return;
			}

			if (tagNames.some((tag) => tag.length > 30)) {
				setError("Each tag must be 30 characters or less.")
				return;
			}

			let tagIds: number[];

			if (tagNames.length === 0) {
				tagIds = (existingReview?.tags ?? []).map((tag) =>
        	typeof tag === "number" ? tag : tag.id
    		);
			} else {
				tagIds = await Promise.all(
					tagNames.map((tag) => getOrCreateTagId(tag))
				);
			}
			
			const body: ReviewT = {
				rating: rating >= 0 ? rating * 10 : undefined,
				difficulty: difficulty >= 0 ? difficulty : undefined,
				comment,
				tags: tagIds,
			};

			const token = session.token;

			const frmData = new FormData(
				document.getElementById("captchaContainer") as HTMLFormElement,
			);
			const proof = frmData.get("cf-turnstile-response");
			if (existingReview === undefined || existingReview === null) {
				if (!captchaToken) {
					setError("Please complete the CAPTCHA.");
					return;
				}
				await API.reviews().putGameReview(
					body,
					proof.toString(),
					`Bearer ${token}`,
					gameId,
				);
			} else {
				await API.reviews().patchReview(
					body,
					`Bearer ${token}`,
					existingReview.id,
				);
			}

			onReviewUpdated();
			setShowWrite(false);
		} catch (err: any) {
			setError("Failed to submit review. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [
		comment,
		difficulty,
		gameId,
		isReviewEmpty,
		onReviewUpdated,
		rating,
		session,
		tags,
	]);

	const handleRemove = useCallback(async (): Promise<void> => {
		if (!existingReview) {
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const body: ReviewT = {
				id: existingReview.id,
				user_id: existingReview.user_id,
				game_id: existingReview.game_id,
				rating: existingReview.rating,
				difficulty: existingReview.difficulty,
				comment: existingReview.comment,
				date_created: existingReview.date_created,
				removed: true,
				tags: (existingReview.tags ?? []).map((tag) =>
					typeof tag === "number" ? tag : tag.id
				),
			};

			const token = session.token;

			await API.reviews().patchReview(
				body,
				`Bearer ${token}`,
				existingReview.id,
			);

			onReviewUpdated();
			setShowWrite(false);
		} catch (err: any) {
			setError("Failed to remove review. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [existingReview, session.token, onReviewUpdated]);

	useEffect(() => {
		let cancelled = false;

		async function loadReview(): Promise<void> {
			setError(null);

			if (!existingReview) {
				setRating(-0.1);
				setDifficulty(-1);
				setComment("");
				setTags("");
				return;
			}

			setRating(existingReview.rating ?? -0.1);
			setDifficulty(existingReview.difficulty ?? -1);
			setComment(existingReview.comment ?? "");
			setTags("");

			const tagIds = (existingReview.tags ?? []).map(
				(tag: number | { id: number }) =>
					typeof tag === "number" ? tag : tag.id
			);

			if (tagIds.length === 0) {
				setTags("");
				return;
			}

			try {
				const tagNames = await Promise.all(
					tagIds.map(async (tagId) => {
						const response = await API.tags().getTags(
							undefined,
							undefined,
							undefined,
							tagId
						);

						const tag = response.data.find(
							(item: { id?: number; name?: string }) =>
								item.id === tagId
						);

						if (!tag?.name) {
							throw new Error(`Failed to load tag: ${tagId}`);
						}

						return tag.name;
					}),
				);

				if (!cancelled) {
					setTags(tagNames.join(" "));
				}
			} catch (err) {
				if (!cancelled) {
					setError("Failed to load review tags.");
				}
			}
		}

		void loadReview();

		return () => {
			cancelled = true;
		};
	}, [existingReview]);

	return (
		<>
			{/* Write Review Button */}
			{!showWrite && (
				<div id="myreviewtoggle" onClick={() => setShowWrite(true)}>
					<Image
						src="/images/pencil.png"
						width={24}
						height={24}
						alt="Write Review"
					/>
					<span className="leading-[26px]">{existingReview ? "Edit Review" : "Write a Review"}</span>
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
							<Link href="/guidelines">rules</Link>
							<span> for reviewing games when writing your review.</span>
						</li>
						<li>
							Make sure to properly tag your spoilers with the spoiler tag:
						</li>
						<li className="list-none">
							<ul>
								<li>"[spoiler]This game has apples![/spoiler]"</li>
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
						<span id="ratingSpan">
							{rating !== -0.1 ? rating : "None"} {getRatingDescription(rating)}
						</span>
					</div>
					<input
						type="range"
						min={-0.1}
						max={10}
						step={0.1}
						value={rating}
						onChange={(e) => setRating(parseFloat(e.target.value))}
						id="rating"
						className="review-slider ui-slider-horizontal"
					/>

					{/* Difficulty Slider */}
					<div className="mt-4">
						<span className="font-medium">My Difficulty: </span>
						<span id="diffSpan">
							{difficulty !== -1 ? difficulty : "None"}{" "}
							{getDifficultyDescription(difficulty)}
						</span>
					</div>
					<input
						type="range"
						min={-1}
						max={100}
						step={1}
						value={difficulty}
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
					<span className="tags_alert" />
					<br />
					<form id="captchaContainer">
						<Captcha onSuccess={setCaptchaToken} />
					</form>
					{/* Submit/Remove Buttons */}
					<div className="flex items-center justify-between mt-4">
						<input
							type="button"
							id="update_button"
							value={existingReview ? "Update Review" : "Submit Review"}
							disabled={loading || isReviewEmpty()}
							onClick={handleSubmit}
						/>
						{existingReview && (
							<input
								type="button"
								id="remove_button"
								value="Remove Review"
								onClick={handleRemove}
							/>
						)}
					</div>
					{error && <span className="text-red-600"> {error}</span>}
				</div>
			)}
		</>
	);
}
