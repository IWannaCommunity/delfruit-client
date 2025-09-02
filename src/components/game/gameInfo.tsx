import Image from "next/image";
import { GameExt } from "delfruit-swagger-cg-sdk";
import Tag from "@/components/game/tag";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AverageBox, { getColor } from "@/components/game/averageBox";
import {
	getRatingDescription,
	getDifficultyDescription,
} from "@/utils/ratingHelpers";

type GameInfoProps = {
	game: GameExt;
};

export default function GameInfo({ game }: GameInfoProps): JSX.Element {

	const router = useRouter();

	return (
		<div className="w-[50%] float-left">
			<h1 className="break-words">{game.name}</h1>

			<h2 id="creator-label" className="mb-[13px]">
				<span>Creator: </span>
				{game.author.map((author, index) => (
					<React.Fragment key={author}>
						<Link href="/">{author}</Link>
						{index < game.author.length - 1 && ", "}
					</React.Fragment>
				))}
			</h2>

			{/* Average Boxes */}
			<div className="w-[380px] m-auto h-[80px]">
				<AverageBox
					label="Average Rating"
					value={game.rating}
					max={10}
					description={getRatingDescription(game.rating)}
					bgColor={getColor(game.rating, 0, 10, "#ff8080", "#7fff80")}
				/>
				<AverageBox
					label="Average Difficulty"
					value={game.difficulty}
					max={100}
					description={getDifficultyDescription(game.difficulty)}
					bgColor={getColor(game.difficulty, 0, 100, "#8080ff", "#ff807f")}
				/>
			</div>

			{/* Download link */}
			{game.url ? (
				<Link
					target="_blank"
					className="standalone"
					id="game-link"
					href={game.url}
				>
					<Image
						src="/images/download.png"
						className="absolute ml-[2px]"
						width={14}
						height={14}
						alt="Download Game"
					/>
					<span>&nbsp;&nbsp;&nbsp;&nbsp; Download Game</span>
				</Link>
			) : (
				<span id="no-link" className="inline-block pb-[1em]">
					[Download Not Available]
				</span>
			)}

			<br />
			<Link className="standalone" href={`/screenshot/upload/${Number(router.query.id)}`}>
				<Image
					src="/images/camera.png"
					className="absolute ml-[2px]"
					width={14}
					height={14}
					alt="Upload Screenshot"
				/>
				<span>&nbsp;&nbsp;&nbsp;&nbsp; Upload a Screenshot</span>
			</Link>
			<br />
			<Link className="standalone" href="/">
				Report Game or Suggest Edit
			</Link>
			<br />

			{/* Checkboxes */}
			<input type="checkbox" id="chk_favourite" />
			<span> Favourite </span>
			<span className="favourite_alert hidden" />
			<br />

			<input type="checkbox" id="chk_clear" />
			<span> Cleared </span>
			<span className="clear_alert hidden" />
			<br />

			<input type="checkbox" id="chk_bookmark" />
			<span> Bookmark </span>
			<span className="bookmark_alert hidden" />
			<br />

			<p>0 people favourited this game!</p>
			<p>Date Submitted: {game.dateCreated}</p>

			{/* Tags */}
			<div>
				<h2>Tags:</h2>
				{game.tags.map((tag) => (
					<Tag key={tag.id} name={tag.name} count={tag.count} />
				))}
			</div>
		</div>
	);
}
