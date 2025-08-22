import Tag from "./game/tag";
import { formatDate } from "../utils/formatDate";
import Link from "next/link";
import React from "react";

type ReviewProps = {
    author: string;
    comment: string;
    rating: number;
    difficulty: number;
    tags?: string[];
    date_created: Date;
    likes: number;
    creator?: boolean;
    game_id?: number;
    game_name: string;
};

export default function Review(props: ReviewProps): JSX.Element {
    return (
        <div className={props.creator ? "owner-review" : "review"}>
            {/* AUTHOR */}
            <a href="/">{props.author}</a>
            {props.creator && <span className="!font-bold">[Creator]</span>}
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
                    {props.tags?.map((tag, index) => {
                        return <Tag name={tag.name} />;
                    })}
                </div>
            )}

            {/* LIKES */}
            <span> [</span>
            <span className="r-like-span">{props.likes}</span>
            <span>] </span>
            <span className="r-like-span-label">Likes</span>

            <div className="!m-[0px]">
                {/* RATING */}
                <span className="!align-middle mr-[0.5em]">
                    Rating: {props.rating?.toFixed(1)}
                </span>
                <span className="hearts">
                    <span className={`!w-rating-[${props.rating}]`}></span>
                </span>
                {/* DIFFICULTY */}
                <span className="!align-middle ml-[2em] mr-[0.5em]">
                    Difficulty: {props.difficulty}
                </span>
                <span className="stars">
                    <span className={`!w-difficulty-[${props.difficulty}]`}></span>
                </span>
                {/* DATE */}
                <div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
                    {formatDate(new Date(props.date_created))}
                </div>
            </div>
        </div>
    );
}
