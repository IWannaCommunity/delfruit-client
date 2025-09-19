import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API } from "@/utils/api";
import { Game, GameExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { useRouter } from "next/router";
import AverageBox, { getColor } from "@/components/game/averageBox";
import { getRatingDescription, getDifficultyDescription } from "@/utils/ratingHelpers";
import Tag from "@/components/game/tag";
import { AnyElem } from "@/utils/element";

type GameInfoProps = {
	game: GameExt;
	onGameUpdated: () => void;
};

function sanitizeGameForPatch(game: GameExt): Game {
	return {
		id: game.id,
		name: game.name ?? "",
		sortname: game.sortname ?? "",
		url: game.url ?? "",
		urlSpdrn: game.urlSpdrn ?? "",
		author: Array.isArray(game.author) ? game.author : [],
		author_raw: Array.isArray(game.author) ? game.author.join(" ") : "",
		collab: Boolean(game.collab),
		dateCreated: game.dateCreated
			? new Date(game.dateCreated).toISOString()
			: undefined,
		adderId: game.adderId != null ? String(game.adderId) : undefined,
		ownerId: game.ownerId != null ? String(game.ownerId) : undefined,
		removed: Boolean(game.removed),
		ownerBio: game.ownerBio ?? "",
	};
}

export default function GameInfo({ game, onGameUpdated }: GameInfoProps): AnyElem {
	const [session] = useSessionContext();
	const router = useRouter();

	// Controlled input states
	const [creatorInput, setCreatorInput] = useState(game.author.join(", "));
	const [dlUrlInput, setDlUrlInput] = useState(game.url ?? "");
	const [ownerInput, setOwnerInput] = useState("");

	// Visibility toggles
	const [hideAdminCreatorInput, setHideAdminCreatorInput] = useState(true);
	const [hideAdminDLUrlInput, setHideAdminDLUrlInput] = useState(true);

	// Alerts
	const [adminCreatorAlertText, setAdminCreatorAlertText] = useState("");
	const [adminDLUrlText, setAdminDLUrlText] = useState("");
	const [adminOwnerText, setAdminOwnerText] = useState("");

	// Checkboxes
	const [isFavourite, setIsFavourite] = useState(false);
	const [isCleared, setIsCleared] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);

	// Handlers
	async function actionAdminChangeGameCreators() {
		try {
			const authors = [creatorInput.trim()];

			const g = sanitizeGameForPatch({
				...game,
				author: authors,
			} as GameExt);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);
			setHideAdminCreatorInput(true);
			setAdminCreatorAlertText("Changes Saved.");

			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminCreatorAlertText("Error: Rejected, changes were not accepted.");
		}
	}

	async function actionAdminChangeDLUrl() {
		try {
			const dl = dlUrlInput.trim() ? new URL(dlUrlInput).href : "";

			const g = sanitizeGameForPatch({
				...game,
				url: dl,
			} as GameExt);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);
			setHideAdminDLUrlInput(true);
			setAdminDLUrlText("Changes Saved.");
			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminDLUrlText("Error: Rejected, download is not a valid URL.");
		}
	}

	async function actionAdminChangeOwner() {
		try {
			const g = sanitizeGameForPatch({
				...game,
				ownerId: ownerInput,
			} as any);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);
			setAdminOwnerText("Changes Saved.");
			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminOwnerText("Error: Rejected, changes were not accepted.");
		}
	}

	return (
		<div className="w-[50%] float-left">
			<h1 className="break-words">{game.name}</h1>

			<h2 id="creator-label" className="mb-[13px]">
				<span>Creator: </span>
				{game.author.length > 0 &&
					game.author[0].split(",").map((author, i, arr) => {
						const trimmed = author.trim();
						return (
							<React.Fragment key={trimmed}>
								<Link href={`/search/?author=${trimmed}`}>{trimmed}</Link>
								{i < arr.length - 1 && ", "}
							</React.Fragment>
						);
					})}
			</h2>

			{session.admin && (
				<>
					<input
						id="admin-creator-input"
						type="text"
						className="w-[95%]"
						value={creatorInput}
						onChange={(e) => setCreatorInput(e.target.value)}
						hidden={hideAdminCreatorInput}
					/>
					<button
						id="admin-change-creator"
						type="button"
						hidden={!hideAdminCreatorInput}
						onClick={() => setHideAdminCreatorInput(false)}
					>
						Change Creator
					</button>
					<button
						id="admin-save-change-creator"
						type="submit"
						hidden={hideAdminCreatorInput}
						className="mr-1 mb-1"
						onClick={async (evt) => {
							evt.preventDefault();
							await actionAdminChangeGameCreators();
						}}
					>
						Change
					</button>
					<button
						id="admin-discard-change-creator"
						type="reset"
						hidden={hideAdminCreatorInput}
						onClick={(evt) => {
							evt.preventDefault();
							setCreatorInput(game.author.join(", "));
							setHideAdminCreatorInput(true);
						}}
					>
						Cancel
					</button>
					<span className="game_creator_update_alert ml-1">{adminCreatorAlertText}</span>
				</>
			)}

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
				<span id="no-link" className="inline-block pb-[1em] mr-1">
					[Download Not Available]
				</span>
			)}
			{session.admin && (
				<>
					<input
						id="admin-download-input"
						type="text"
						className="w-[95%]"
						value={dlUrlInput}
						onChange={(e) => setDlUrlInput(e.target.value)}
						hidden={hideAdminDLUrlInput}
					/>
					<button
						id="admin-change-download"
						type="button"
						hidden={!hideAdminDLUrlInput}
						className="ml-1"
						onClick={() => setHideAdminDLUrlInput(false)}
					>
						Change URL
					</button>
					<button
						id="admin-save-change-download"
						type="submit"
						hidden={hideAdminDLUrlInput}
						className="mr-1"
						onClick={async (evt) => {
							evt.preventDefault();
							await actionAdminChangeDLUrl();
						}}
					>
						Change
					</button>
					<button
						id="admin-discard-change-download"
						type="reset"
						hidden={hideAdminDLUrlInput}
						onClick={(evt) => {
							evt.preventDefault();
							setDlUrlInput(game.url ?? "");
							setHideAdminDLUrlInput(true);
						}}
					>
						Cancel
					</button>
					<span className="game_creator_update_alert ml-1">{adminDLUrlText}</span>
				</>
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
					<Link className="standalone" href={`/report/game/${router.query.id}`}>
						Report Game or Suggest Edit
					</Link>
					<br />

					{/* Checkboxes */}
					<input
						type="checkbox"
						id="chk_favourite"
						checked={isFavourite}
						onChange={() => setIsFavourite(!isFavourite)}
					/>
					<span> Favourite </span>
					<span className="favourite_alert">{isFavourite ? "Updated!" : ""}</span>
					<br />

					<input
						type="checkbox"
						id="chk_clear"
						checked={isCleared}
						onChange={() => setIsCleared(!isCleared)}
					/>
					<span> Cleared </span>
					<span className="clear_alert">{isCleared ? "Updated!" : ""}</span>
					<br />

					<input
						type="checkbox"
						id="chk_bookmark"
						checked={isBookmarked}
						onChange={() => setIsBookmarked(!isBookmarked)}
					/>
					<span> Bookmark </span>
					<span className="bookmark_alert">{isBookmarked ? "Updated!" : ""}</span>
					<br />
				</>
			)}
			<br />
			<span className="leading-[1.5] mt-5">0 people favourited this game!</span>
			<br />
			<span className="leading-[1.5]">Date Submitted: {game.dateCreated}</span>
			<br />

			{/* Admin Tools */}
			{session.admin && (
				<>
					<br />
					<h2>ADMIN TOOLS</h2>
					<p>
						<Link href="/admin/remove_game">Remove Game</Link>
						<br />
						<span>Owner: </span>
						<input
							id="owner-field"
							type="text"
							size={15}
							value={ownerInput}
							onChange={(e) => setOwnerInput(e.target.value)}
						/>
						<button
							id="owner-btn"
							type="submit"
							onClick={async (evt) => {
								evt.preventDefault();
								await actionAdminChangeOwner();
							}}
						>
							Update
						</button>
						<br />
						<span id="owner-alert">{adminOwnerText}</span>
					</p>
				</>
			)}

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