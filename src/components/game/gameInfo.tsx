import Image from "next/image";
import Whitespace from "../whitespace";
import { GameExt } from "delfruit-swagger-cg-sdk";
import Tag from "./tag";

type GameInfoProps = {
	game: GameExt;
};

export default function GameInfo(props: GameInfoProps): JSX.Element {
	return (
		<div className="!w-[50%] !float-left">
			<h1 className="!wrap-break-word">{props.game.name} </h1>
			<h2 id="creator-label" className="!mb-[13px]">
				Creator: <a href="/">{props.game.author}</a>
			</h2>
			<div className="!w-[380px] !m-auto !h-[80px]">
				<div className="rating !bg-[#a7d780]">
					<span>Average Rating</span>
					<div>
						<span id="avgRating">
							{
								// QUEST: is this mechanism complex? heck yea it is. can we simplify it? no clue
								props.game.ratings.rating !== -1 ? (
									<>{props.game.ratings.rating} / 10 </>
								) : (
									"N/A"
								)
							}
						</span>
						<br />
						<span className="description" id="avgRatingLabel">
							Good
						</span>
					</div>
				</div>
				<div className="rating !bg-[#d480aa]">
					<span>Average Difficulty</span>
					<div>
						<span id="avgDifficulty">
							{
								// QUEST: yep, this one is the same as the one above
								props.game.ratings.difficulty !== -1 ? (
									<>{props.game.ratings.difficulty} / 100 </>
								) : (
									"N/A"
								)
							}
						</span>
						<br />
						<span className="description" id="avgDiffLabel">
							Good
						</span>
					</div>
				</div>
			</div>
			{props.game.url ? (
				<a
					target="_blank"
					className="standalone"
					id="game-link"
					href={props.game.url}
				>
					<Image
						src="/images/download.png"
						className="!absolute !ml-[2px]"
						width={14}
						height={14}
						alt="Write Review"
					/>
					<span> &nbsp;&nbsp;&nbsp;&nbsp; Download Game</span>
				</a>
			) : (
				<span id="no-link" className="!inline-block !pb-[1em] !hidden">
					[Download Not Available]
				</span>
			)}
			<br />
			<a className="standalone" href="/">
				<Image
					src="/images/camera.png"
					className="!absolute !ml-[2px]"
					width={14}
					height={14}
					alt="Upload Screenshot"
				/>
				<span> &nbsp;&nbsp;&nbsp;&nbsp; Upload a Screenshot </span>
			</a>
			<br />
			<a className="standalone" href="/">
				Report Game or Suggest Edit
			</a>
			<br />
			<input type="checkbox" id="chk_favourite" />
			<span>Favourite </span>
			<span className="favourite_alert !hidden"></span>
			<br />
			<input type="checkbox" id="chk_clear" />
			<span>Cleared </span>
			<span className="clear_alert !hidden"></span>
			<br />
			<input type="checkbox" id="chk_bookmark" />
			<span>Bookmark </span>
			<span className="bookmark_alert !hidden"></span>
			<p>0 people favourited this game!</p>
			<p> Date Submitted: {new Date(props.game.dateCreated).toDateString()} </p>
			<div>
				<h2>Tags:</h2>
				{props.game.tags.map((tag) => {
					return <Tag name={tag} count={1} />;
				})}
			</div>
		</div>
	);
}
