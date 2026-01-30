import Head from "next/head";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Review from "@/components/review";
import type { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API } from "@/utils/api";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";

function buildRemovalMessage(gameName: string, adminComment: string): string {
	const comment =
		adminComment && adminComment.trim().length > 0
			? adminComment
			: "No additional comment provided.";

	return (
		"Your review for " + gameName + " was removed by an admin!\n\n" +
		"Message: " + comment + "\n\n" +
		"We saved your review on the game page; you can edit and resubmit it if you would like.\n\n" +
		"Thanks!"
	);
}

export default function RemoveReview(): AnyElem {
	const [session] = useSessionContext();
	const [review, setReview] = useState<ReviewT | null>(null);
	const [comment, setComment] = useState("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!session.active || !session.admin || !session.token || !review) {
			setError("You are not authorized to perform this action.");
			return;
		}

		const patchedReview: ReviewT = {
			id: review.id,
			user_id: review.user_id,
			game_dd: review.game_id,
			removed: true,
			tags: review.tags?.map((tag: any) => tag.id) ?? [],
		};
		
		try {
			await API.reviews().patchReview(
				patchedReview,
				`Bearer ${session.token}`,
				review.id,
			);

			const messageBody = buildRemovalMessage(
				review.game_name,
				comment
			);

			await API.messages().postMessage(
				{
					userToId: review.user_id,
					subject: "[Moderation] Review Removed by Admin",
					body: messageBody,
				},
				`Bearer ${session.token}`,
			);

			setSuccess(true);

			setTimeout(() => {
				router.replace("/");
			}, 3000);
		} catch {
			setError("Failed to remove review.");
			setSuccess(false);
		}
	}

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		if (isNaN(id) || id <= 0) {
			setError("Invalid review ID");
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await API.reviews().getReview(id);
				if (!resp.data) {
					setError("Review not found");
					return;
				}
				setReview({
					id: Number(resp.data.id),
					user_id: Number(resp.data.user_id),
					game_id: resp.data.game_id,
					user_name: resp.data.user_name,
					game_name: resp.data.game_name,
					date_created: formatDate(new Date(resp.data.date_created)),
					removed: resp.data.removed,
					comment: resp.data.comment,
					rating:
						resp.data.rating === null
							? null
							: Number(resp.data.rating / 10).toFixed(1),
					difficulty:
						resp.data.difficulty === null ? null : Number(resp.data.difficulty),
					like_count: Number(resp.data.like_count),
					owner_review: resp.data.owner_review === 1,
					tags: resp.data.tags,
				});
			} catch {
				setError("Failed to load review");
			} finally {
				setLoading(false);
			}
		})();
	}, [router, router.isReady, router.query.id]);

	const renderContent = () => {
		if (!session.active || !session.admin) {
			return <span>You do not have access to this page</span>;
		}

		if (loading) return <span>Loading...</span>;
		if (success) {
			return (
				<span className="font-semibold">
					Review successfully removed.
				</span>
			);
		}
		if (!review) return null;

		return (
			<>
				<h2>Remove Review</h2>

				<p className="mb-4">Are you sure you want to remove the review:</p>

				{review && (
					<Review
						key={review.id}
						id={review.id}
						user_id={review.user_id}
						game_id={review.game_id}
						rating={review.rating}
						difficulty={review.difficulty}
						comment={review.comment}
						date_created={review.date_created}
						removed={review.removed}
						user_name={review.user_name}
						game_name={review.game_name}
						like_count={review.like_count}
						owner_review={review.owner_review}
						tags={review.tags}
						hideActions
					/>
				)}

				<form className="mt-4" onSubmit={handleSubmit}>
					<label className="group">
						<span className="group-focus-within:font-bold">
							Leave a comment for the user:
						</span>
						<br />
						<textarea
							id="admin_comment"
							name="admin_comment"
							value={comment}
							onChange={(e) => {
								setComment(e.target.value);
								setError(null);
							}}
						/>
					</label>
					<br />
					<input
						type="submit"
						value="Remove"
						className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
					/>
					{error && !success && <span className="text-red-600 ml-2">{error}</span>}
				</form>
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{renderContent()}
				</div>
				<Footer />
			</div>
		</div>
	);
}