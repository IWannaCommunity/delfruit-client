import Tag from "./game/tag";
import Link from "next/link";
import React from "react";

type ReviewProps = {
		user_id: number;
		game_id: number;
		rating: number | string;
    difficulty: number | string;
		comment: string;
		date_created: Date | null;
		removed: boolean;
    user_name: string;
    game_name: string;
    like_count: number;
		owner_review?: boolean;
    tags?: string[];
};

export default function Review(props: ReviewProps): JSX.Element {
	return (
		<div className={props.owner_review ? "owner-review" : "review"}>
			{/* AUTHOR */}
			<Link href="/">{props.user_name}</Link>
			{props.owner_review && <span className="!font-bold">[Creator]</span>}
			<br />

			{/* GAME NAME */}
			<span> For: </span>
			<Link href={`/game/${props.game_id}`}>{props.game_name}</Link>
			<br />

			{/* COMMENT */}
			<div className="review-text !wrap-break-word">
				<span>{props.comment}</span>
			</div>

			{/* TAGS */}
			{props.tags && props.tags.length > 0 && (
				<div className="!mb-[0px]">
					<span> Tagged as: </span>
					{props.tags?.map((tag) => {
						return <Tag name={tag.name} key={tag.id} />;
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
					Rating: {props.rating}
				</span>
				<span className="hearts">
					<span style={{ width: `${170 * (props.rating / 10)}px` }}></span>
				</span>
				{/* DIFFICULTY */}
				<span className="!align-middle ml-[2em] mr-[0.5em]">
					Difficulty: {props.difficulty}
				</span>
				<span className="stars">
					<span style={{ width: `${170 * (props.difficulty / 100)}px` }}></span>
				</span>
				{/* DATE */}
				<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
					{props.date_created}
				</div>
			</div>
		</div>
	);
}
