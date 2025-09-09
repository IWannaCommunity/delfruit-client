import Tag from "@/components/game/tag";
import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";
import { API } from "@/utils/api";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";

export default function Review(props: ReviewT): JSX.Element {
	const [expanded, setExpanded] = useState(false);
	const [session] = useSessionContext();
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(props.like_count);
	const [disabled, setDisabled] = useState(false);

	const maxLength = 500;
	const shouldTruncate = props.comment
		? props.comment.length > maxLength
		: false;
	const displayText =
		expanded || !shouldTruncate
			? props.comment
			: props.comment.slice(0, maxLength) + "...";

	const tempDisable = () => {
		setDisabled(true);
		setTimeout(() => setDisabled(false), 1000);
	}

	useEffect(() => {
		const checkLiked = async () => {
			if (!session.active || !session.token) return;

			try {
				// NOTE: THIS IS THE GET FUNCTION
				const res = await API.reviews().deleteReviewLike(
					`Bearer ${session.token}`,
					props.id,
					session.user_id
				);

				if (typeof res.data === "boolean") {
					setLiked(res.data);
				} else {
					setLiked(false);
				}
			} catch (error: any) {
				setLiked(false);
			}
		};
		checkLiked();
	}, [session, props.id, props.user_id]);

	const likeReview = async () => {
		if (!session.active || !session.token) return;

		setLikeCount((prev: number) => prev + 1);
		setLiked(true);
		tempDisable();

		try {
			await API.reviews().putReviewLike(
					`Bearer ${session.token}`,
					props.id,
					session.user_id,
				);
		} catch (error) {
			setLikeCount((prev: number) => prev - 1);
		}
	}

	const unlikeReview = async () => {
		if (!session.active || !session.token || !liked) return;
		
		setLikeCount((prev: number) => prev - 1);
		setLiked(false);
		tempDisable();

		try {
			await API.reviews().deleteReviewLike_1(
				`Bearer ${session.token}`,
				props.id,
				session.user_id
			);
		} catch (error) {
			setLikeCount((prev: number) => prev + 1);
			setLiked(true);
		}
	};

	return (
		<div className={`review ${props.owner_review ? "owner-review" : ""}`}>
			{/* AUTHOR */}
			<Link href={`/profile/${props.user_id}`}>{props.user_name}</Link>
			{props.owner_review && <span className="!font-bold">[Creator]</span>}
			<br />

			{/* GAME NAME */}
			{props.game_id && (
				<>
					<span> For: </span>
					<Link href={`/game/${props.game_id}`}>{props.game_name}</Link>
					<br />
				</>
			)}

			{/* COMMENT */}
			{props.comment !== "" && props.comment !== null && (
				<div>
					<div className="review-text !wrap-break-word">
						<span>{displayText}</span>
					</div>

					{shouldTruncate && (
						<a
							className="standalone underline cursor-pointer"
							onClick={() => setExpanded(!expanded)}
						>
							{expanded ? "Show less" : "Read more"}
						</a>
					)}
				</div>
			)}

			{/* TAGS */}
			{props.tags && props.tags.length > 0 && (
				<div className="!mb-[0px]">
					<span> Tagged as: </span>
					{props.tags.map((tag: any) => {
						return <Tag key={tag.id} id={tag.id} name={tag.name} />;
					})}
				</div>
			)}

			{/* LIKES */}
			<span> [</span>
			<span className="r-like-span">{likeCount}</span>
			<span>] </span>
			<span className="r-like-span-label">Likes</span>
			{session.active && (
				<a 
					onClick={
						!disabled ? (liked ? unlikeReview : likeReview) : undefined
					}
					className={`underline ml-1 cursor-pointer ${
						disabled ? "opacity-50 pointer-events-none" : ""
					}`}
				>
					{liked ? "Unlike this review" : "Like this review"}
				</a>
			)}

			<div className="!m-[0px]">
				{/* RATING */}
				<span className="!align-middle mr-[0.5em]">
					Rating: {props.rating === null ? "N/A" : `${props.rating}`}
				</span>
				{props.rating !== null ? (
					<span className="hearts">
						<span style={{ width: `${170 * (props.rating / 10)}px` }} />
					</span>
				) : (
					<span className="inline-block w-[170px] h-[16px]" />
				)}
				{/* DIFFICULTY */}
				<span className="!align-middle ml-[2em] mr-[0.5em]">
					Difficulty:
					{props.difficulty === null ? " N/A" : ` ${props.difficulty}`}
				</span>
				{props.difficulty !== null ? (
					<span className="stars">
						<span style={{ width: `${170 * (props.difficulty / 100)}px` }} />
					</span>
				) : (
					<span className="inline-block w-[170px] h-[16px]" />
				)}
				{/* DATE */}
				<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
					{props.date_created}

					{/* Buttons */}
					{session.active && (
						<Link href={`/report/${props.id}`} className="ml-1">Report</Link>
					)}
				</div>
			</div>
		</div>
	);
}
