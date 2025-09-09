import Image from "next/image";
import { Game, GameExt, GamesApi } from "delfruit-swagger-cg-sdk";
import Tag from "@/components/game/tag";
import React, { useState } from "react";
import Link from "next/link";
import { useSessionContext } from "@/utils/hooks";
import { useRouter } from "next/router";
import AverageBox, { getColor } from "@/components/game/averageBox";
import {
	getRatingDescription,
	getDifficultyDescription,
} from "@/utils/ratingHelpers";
import { AnyElem } from "@/utils/element";
import { Config } from "@/utils/config";

type GameInfoProps = {
	game: GameExt;
};

const CFG: Config = require("@/config.json");

const GAMESCLIENT: GamesApi = new GamesApi(void 0, CFG.apiURL.toString());

export default function GameInfo({ game }: GameInfoProps): AnyElem {
	const [session, setSession] = useSessionContext();

	const router = useRouter();

	const [hideAdminCreatorInput, setHideAdminCreatorInput] =
		useState<boolean>(true);
	const [adminCreatorAlertText, setAdminCreatorAlertText] =
		useState<string>("");

	function toggleAdminCreatorInput() {
		setHideAdminCreatorInput(!hideAdminCreatorInput);
	}

	async function actionAdminChangeGameCreators() {
		try {
			const g = JSON.parse(JSON.stringify(game)) satisfies Game;
			// DANGER: typically, DON'T DO THIS IN REACT, but I have no page reactivity
			// so it's fine here.
			g.author = document.getElementById("admin-creator-input").value;
			console.log(g);
			const resp = await GAMESCLIENT.patchGame(g, session.token, game.id);
			toggleAdminCreatorInput();
			setAdminCreatorAlertText("Changes Saved.");
		} catch (e) {
			setAdminCreatorAlertText("Error: Rejected, changes were not accepted.");
		}
	}

	return (
		<div className="w-[50%] float-left">
			<h1 className="break-words">{game.name}</h1>

			<h2 id="creator-label" className="mb-[13px]">
				<span>Creator: </span>
				{game.author.map((author, index) => (
					<React.Fragment key={author}>
						<Link href={`/search/?author=${author}`}>{author}</Link>
						{index < game.author.length - 1 && ", "}
					</React.Fragment>
				))}
			</h2>

			<input
				id="admin-creator-input"
				type="text"
				className="w-[95%]"
				defaultValue={game.author}
				hidden={hideAdminCreatorInput}
			/>
			<button
				id="admin-change-creator"
				type="button"
				hidden={!hideAdminCreatorInput}
				onClick={async (
					evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
				) => {
					evt.preventDefault();
					toggleAdminCreatorInput();
				}}
			>
				Change Creator
			</button>
			<button
				id="admin-save-change-creator"
				type="submit"
				hidden={hideAdminCreatorInput}
				onClick={async (
					evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
				) => {
					evt.preventDefault();
					await actionAdminChangeGameCreators();
				}}
			>
				Change
			</button>{" "}
			<button
				id="admin-discard-change-creator"
				type="reset"
				hidden={hideAdminCreatorInput}
				onClick={async (
					evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
				) => {
					evt.preventDefault();
					toggleAdminCreatorInput();
				}}
			>
				Cancel
			</button>
			<span className="game_creator_update_alert">{adminCreatorAlertText}</span>

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

			{/* Speedrun Leaderboard */}
			{game.urlSpdrn && (
				<>
					<Link className="standalone" href={game.urlSpdrn}>
						<Image
							src="/images/stopwatch.png"
							className="absolute ml-[2px]"
							width={14}
							height={14}
							alt="stopwatch"
						/>
						<span>&nbsp;&nbsp;&nbsp;&nbsp; Speedrun Leaderboards</span>
					</Link>
					<br />
				</>
			)}

			{/* Upload Screenshot */}
			{session.active && (
				<>
					<Link
						className="standalone"
						href={`/screenshot/upload/${Number(router.query.id)}`}
					>
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

					{/* Report Game */}
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
				</>
			)}
			<br />
			<span className="leading-[1.5] mt-5">0 people favourited this game!</span>
			<br />
			<span className="leading-[1.5]">Date Submitted: {game.dateCreated}</span>
			<br />

			{/* Tags */}
			<div className="mt-5">
				<h2>Tags:</h2>
				{game.tags.map((tag) => (
					<Tag key={tag.id} id={tag.id} name={tag.name} count={tag.count} />
				))}
			</div>
		</div>
	);
}
