import Tag from "@/components/game/tag";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { Review as ReviewT } from "delfruit-swagger-cg-sdk";

export default function Review(props: ReviewT): JSX.Element {
	const [expanded, setExpanded] = useState(false);

	const maxLength = 500;
	const shouldTruncate = props.comment.length > maxLength;
	const displayText = expanded || !shouldTruncate ? props.comment : props.comment.slice(0, maxLength) + "...";

	return (
		<div className={`review ${props.owner_review ? "owner-review" : ""}`}>
			{/* AUTHOR */}
			<Link href={`/user/${props.user_id}`}>{props.user_name}</Link>
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
			{props.comment !== "" && (
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
			<span className="r-like-span">{props.like_count}</span>
			<span>] </span>
			<span className="r-like-span-label">Likes</span>

			<div className="!m-[0px]">
				{/* RATING */}
				<span className="!align-middle mr-[0.5em]">
					Rating: {props.rating === null ? "N/A" : `${props.rating}`}
				</span>
				{
					props.rating !== null ? (
						<span className="hearts">
							<span style={{ width: `${170 * (props.rating / 10)}px` }}/>
						</span>
				) : (
					<span className="inline-block w-[170px] h-[16px]"/>
				)}
				{/* DIFFICULTY */}
				<span className="!align-middle ml-[2em] mr-[0.5em]">
					Difficulty: {props.difficulty === null ? "N/A" : `${props.difficulty}`}
				</span>
				{
					props.difficulty !== null ? (
						<span className="stars">
							<span style={{ width: `${170 * (props.difficulty / 100)}px` }}/>
						</span>
				) : (
					<span className="inline-block w-[170px] h-[16px]"/>
				)}
				{/* DATE */}
				<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
					{props.date_created}
				</div>
			</div>
		</div>
	);
}
