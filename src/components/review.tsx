import Tag from "./game/tag";
import Whitespace from "./whitespace";

type ReviewProps = {
    author: string;
    comment: string;
    rating: number;
    difficulty: number;
    tags?: string[];
    dateCreated: string;
    likes: number;
    creator?: boolean;
    gameId?: number;
};

export default function Review(props: ReviewProps): JSX.Element {
    return (
        <div className={props.creator ? "owner-review" : "review"}>
            <a href="/">{props.author}</a>
            <Whitespace />
            {props.creator && <span className="!font-bold">[Creator]</span>}
            <br />
            {props.gameId && (
                <>
                    <span> For: </span>
                    <a href="/">I wanna be the Blank</a>
                </>
            )}
            <br />
            <div className="review-text !wrap-break-word">
                <span>{props.comment}</span>
            </div>
            <div className="!mb-[0px]">
                <span> Tagged as: </span>
                {props.tags?.map((tag) => {
                    return <Tag name={tag} />;
                })}
            </div>
            <span> [</span>
            <span className="r-like-span">{props.likes}</span>
            <span>] </span>
            <span className="r-like-span-label">Likes</span>
            <div className="!m-[0px]">
                <span className="!align-middle">Rating: {props.rating}</span>
                <Whitespace />
                <span title="10.0" className="hearts">
                    <span className="!w-[170px]"></span>
                </span>
                <span> &nbsp; &nbsp; &nbsp; </span>
                <span className="!align-middle">Difficulty: {props.difficulty}</span>
                <span title="40" className="stars">
                    <span className="!w-[70px]"></span>
                </span>
                <div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
                    {" "}
                    {new Date(props.dateCreated).toDateString()}{" "}
                </div>
            </div>
        </div>
    );
}

