import type { Game, GameExt } from "delfruit-swagger-cg-sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useReducer, useState, useEffect } from "react";
import AverageBox, { getColor } from "@/components/game/averageBox";
import Tag from "@/components/game/tag";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";
import {
	getDifficultyDescription,
	getRatingDescription,
} from "@/utils/ratingHelpers";

type UserAction =
	| { type: "favoriting" }
	| { type: "unfavorite" }
	| { type: "clearing" }
	| { type: "unclear" }
	| { type: "bookmarking" }
	| { type: "unbookmark" };

interface GameInfoProps {
	readonly game: GameExt;
	initialUserState: UserState;
	onGameUpdated: VoidFunction;
}

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
		ownerId: game.ownerId != null ? String(game.ownerId) : null,
		removed: Boolean(game.removed)
	};
}

function userStateReducer(
	state: UserState,
	action: UserAction,
): UserState {
	switch (action.type) {
		case "favoriting":
			return { ...state, favorited: true };

		case "unfavorite":
			return { ...state, favorited: false };

		case "clearing":
			return { ...state, cleared: true };

		case "unclear":
			return { ...state, cleared: false };

		case "bookmarking":
			return { ...state, bookmarked: true };

		case "unbookmark":
			return { ...state, bookmarked: false };

		default:
			return state;
	}
}

export default function GameInfo({
	game,
	initialUserState,
	onGameUpdated,
}: GameInfoProps): AnyElem {
	const [session] = useSessionContext();
	const router = useRouter();

	// Controlled input states
	const [gameNameInput, setGameNameInput] = useState(game.name);
	const [creatorInput, setCreatorInput] = useState(game.author.join(", "));
	const [dlUrlInput, setDlUrlInput] = useState(game.url ?? "");
	const [speedrunInput, setSpeedrunInput] = useState(game.urlSpdrn ?? "");
	const [dateInput, setDateInput] = useState(
		game.dateCreated
			? new Date(game.dateCreated).toISOString().slice(0, 10)
			: ""
	);
	const [ownerInput, setOwnerInput] = useState("");

	// Visibility toggles
	const [hideAdminGameNameInput, setHideAdminGameNameInput] = useState(true);
	const [hideAdminCreatorInput, setHideAdminCreatorInput] = useState(true);
	const [hideAdminDLUrlInput, setHideAdminDLUrlInput] = useState(true);
	const [hideAdminSpeedrunInput, setHideAdminSpeedrunInput] = useState(true);
	const [hideAdminDateInput, setHideAdminDateInput] = useState(true);

	// Alerts
	const [adminGameNameAlertText, setAdminGameNameAlertText] = useState("");
	const [adminCreatorAlertText, setAdminCreatorAlertText] = useState("");
	const [adminDLUrlText, setAdminDLUrlText] = useState("");
	const [adminSpeedrunAlertText, setAdminSpeedrunAlertText] = useState("");
	const [adminDateText, setAdminDateText] = useState("");
	const [adminOwnerText, setAdminOwnerText] = useState("");

	const [userstate, mutateUserState] = useReducer(userStateReducer,initialUserState);

	async function handleCheckboxes(
    type: UserAction["type"],
	) {
		const actions = {
			favoriting: () =>
				API.lists().putFavoriteGame(`Bearer ${session.token}`, game.id),
			unfavorite: () =>
				API.lists().deleteFavoritedGame(`Bearer ${session.token}`, game.id),
			clearing: () =>
				API.lists().putClearGame(`Bearer ${session.token}`, game.id),
			unclear: () =>
				API.lists().deleteClearedGame(`Bearer ${session.token}`, game.id),
			bookmarking: () =>
				API.lists().putBookmarkGame(`Bearer ${session.token}`, game.id),
			unbookmark: () =>
				API.lists().deleteBookmarkedGame(`Bearer ${session.token}`, game.id),
		};

		try {
			await actions[type]();
			mutateUserState({ type });
		} catch (error) {
			throw new Error("Failed to update state.");
		}
	}

	async function actionAdminChangeGameName() {
		try {
			const g = sanitizeGameForPatch({
				...game,
				name: gameNameInput.trim(),
			} as GameExt);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);

			setHideAdminGameNameInput(true);
			setAdminGameNameAlertText("Changes Saved.");

			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminGameNameAlertText(
				"Error: Rejected, game name was not accepted."
			);
		}
	}

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

	async function actionAdminChangeSpeedrunUrl() {
		try {
			const speedrunUrl = speedrunInput.trim()
				? new URL(speedrunInput).href
				: "";

			const g = sanitizeGameForPatch({
				...game,
				urlSpdrn: speedrunUrl,
			} as GameExt);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);

			setHideAdminSpeedrunInput(true);
			setAdminSpeedrunAlertText("Changes Saved.");

			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminSpeedrunAlertText(
				"Error: Rejected, speedrun link is not a valid URL."
			);
		}
	}

	async function actionAdminChangeDate() {
		try {
			const g = sanitizeGameForPatch({
				...game,
				dateCreated: dateInput,
			} as GameExt);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);
			setHideAdminDateInput(true);
			setAdminDateText("Changes Saved.");

			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminDateText("Error: Rejected, date is invalid.");
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

	async function actionAdminRemoveOwner() {
		try {
			const g = sanitizeGameForPatch({
				...game,
				ownerId: null
			} as any);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);
			setAdminOwnerText("Changes Saved.");
			if (onGameUpdated) onGameUpdated();
		} catch {
			setAdminOwnerText("Error: Rejected, changes were not accepted.");
		}
	}

	useEffect(() => {
		async function fetchOwner() {
			if (!game.ownerId) {
				setOwnerInput("");
				return;
			}

			try {
				const owner = await API.users().getUser(game.ownerId);
				setOwnerInput(owner.data.name);
			} catch {
				setOwnerInput("");
			}
		}

		fetchOwner();
	}, [game.ownerId]);

	return (
		<div className="w-[50%] float-left">
			<div>

				{/* Game Title */}
				<h1 className="break-words">{game.name}</h1>

				{session.admin && (
					<>
						<button
							id="admin-change-game-name"
							type="button"
							hidden={!hideAdminGameNameInput}
							onClick={() => setHideAdminGameNameInput(false)}
						>
							Change Title
						</button>

						<input
							id="admin-game-name-input"
							type="text"
							className="w-[95%]"
							value={gameNameInput}
							onChange={(e) => setGameNameInput(e.target.value)}
							hidden={hideAdminGameNameInput}
						/>

						<button
							id="admin-save-game-name"
							type="button"
							hidden={hideAdminGameNameInput}
							onClick={actionAdminChangeGameName}
						>
							Save
						</button>

						<button
							id="admin-discard-game-name"
							type="button"
							hidden={hideAdminGameNameInput}
							onClick={() => {
								setGameNameInput(game.name);
								setHideAdminGameNameInput(true);
							}}
						>
							Cancel
						</button>

						<span className="game_creator_update_alert ml-1">
							{adminGameNameAlertText}
						</span>
					</>
				)}
			</div>

			{/* Creators */}
			<h2 id="creator-label" className="mb-[13px]">
				<span>{game.author.length === 1 ? "Creator: " : "Creators: "}</span>
				{game.author.length > 0 &&
					game.author.map((author, i, arr) => {
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
						type="button"
						hidden={hideAdminCreatorInput}
						onClick={(evt) => {
							evt.preventDefault();
							setCreatorInput(game.author.join(", "));
							setHideAdminCreatorInput(true);
						}}
					>
						Cancel
					</button>
					<span className="game_creator_update_alert ml-1">
						{adminCreatorAlertText}
					</span>
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
						type="button"
						hidden={hideAdminDLUrlInput}
						onClick={(evt) => {
							evt.preventDefault();
							setDlUrlInput(game.url ?? "");
							setHideAdminDLUrlInput(true);
						}}
					>
						Cancel
					</button>
					<span className="game_creator_update_alert ml-1">
						{adminDLUrlText}
					</span>
				</>
			)}
			<br />

			{/* Speedrun Leaderboard */}
			{(game.urlSpdrn || session.admin) && (
				<>
					{game.urlSpdrn && (
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
					)}

					{session.admin && (
						<>
							<button
								id="admin-change-speedrun"
								type="button"
								className="ml-2"
								hidden={!hideAdminSpeedrunInput}
								onClick={() => setHideAdminSpeedrunInput(false)}
							>
								{game.urlSpdrn ? "Change Speedrun Link" : "Add Speedrun Link"}
							</button>

							<input
								id="admin-speedrun-input"
								type="text"
								className="w-[95%]"
								value={speedrunInput}
								onChange={(e) => setSpeedrunInput(e.target.value)}
								hidden={hideAdminSpeedrunInput}
							/>

							<button
								id="admin-save-change-speedrun"
								type="button"
								hidden={hideAdminSpeedrunInput}
								onClick={actionAdminChangeSpeedrunUrl}
							>
								Save
							</button>

							<button
								id="admin-discard-change-speedrun"
								type="button"
								hidden={hideAdminSpeedrunInput}
								onClick={() => {
									setSpeedrunInput(game.urlSpdrn ?? "");
									setHideAdminSpeedrunInput(true);
									setAdminSpeedrunAlertText("");
								}}
							>
								Cancel
							</button>

							<span className="ml-1">
								{adminSpeedrunAlertText}
							</span>
							<br />
						</>
					)}

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
						id="chk_favorite"
						checked={userstate.favorited}
						onChange={(e) =>
							handleCheckboxes(
								e.target.checked ? "favoriting" : "unfavorite"
							)
						}
					/>
					<span> Favorite </span>
					<span className="favorite_alert">
						{userstate.favorited ? "Favorited!" : ""}
					</span>
					<br />

					<input
						type="checkbox"
						id="chk_clear"
						checked={userstate.cleared}
						onChange={(e) =>
							handleCheckboxes(
								e.target.checked ? "clearing" : "unclear"
							)
						}
					/>
					<span> Cleared </span>
					<span className="clear_alert">
						{userstate.cleared ? "Cleared!" : ""}
					</span>
					<br />

					<input
						type="checkbox"
						id="chk_bookmark"
						checked={userstate.bookmarked}
						onChange={(e) =>
							handleCheckboxes(
								e.target.checked ? "bookmarking" : "unbookmark"
							)
						}
					/>
					<span> Bookmark </span>
					<span className="bookmark_alert">
						{userstate.bookmarked ? "Bookmarked!" : ""}
					</span>
					<br />
				</>
			)}
			<br />

			<span className="leading-[1.5] mt-5">
				{game.favorited} {game.favorited === 1 ? "person" : "people"} favorited this game!
			</span>
			<br />

			{/* Date */}
			<span className="leading-[1.5]">Date Submitted: {game.dateCreated}</span>
			{session.admin && (
				<>
					<input
						id="admin-date-input"
						type="date"
						className="w-[95%]"
						value={dateInput}
						onChange={(e) => setDateInput(e.target.value)}
						hidden={hideAdminDateInput}
					/>
					<button
						id="admin-change-date"
						type="button"
						hidden={!hideAdminDateInput}
						className="ml-1"
						onClick={() => setHideAdminDateInput(false)}
					>
						Change Date
					</button>
					<button
						id="admin-save-change-date"
						type="submit"
						hidden={hideAdminDateInput}
						className="mr-1"
						onClick={async (evt) => {
							evt.preventDefault();
							await actionAdminChangeDate();
						}}
					>
						Change
					</button>
					<button
						id="admin-discard-change-date"
						type="button"
						hidden={hideAdminDateInput}
						onClick={(evt) => {
							evt.preventDefault();
							setDateInput(
								game.dateCreated
									? new Date(game.dateCreated).toISOString().slice(0, 10)
									: ""
							);
							setHideAdminDateInput(true);
						}}
					>
						Cancel
					</button>
					<span className="game_date_update_alert ml-1">
						{adminDateText}
					</span>
				</>
			)}
			<br />

			{/* Admin Tools */}
			{session.admin && (
				<>
					<br />
					<h2>ADMIN TOOLS</h2>
					<p>
						<Link href={`/admin/remove_game/${game.id}`}>Remove Game</Link>
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
						<button
							id="owner-remove-btn"
							type="submit"
							onClick={async (evt) => {
								evt.preventDefault();
								await actionAdminRemoveOwner();
							}}
						>
							Remove
						</button>
						<br />
						<span id="owner-alert">{adminOwnerText}</span>
					</p>
				</>
			)}

			{/* Tags */}
			{game.tags.length > 0 && (
				<div className="mt-5">
					<h2>Tags:</h2>
					{game.tags.map((tag) => (
						<Tag key={tag.id} id={tag.id} name={tag.name} count={tag.count} />
					))}
				</div>
			)}
		</div>
	);
}

