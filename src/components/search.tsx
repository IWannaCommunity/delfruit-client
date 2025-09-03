import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";
import { formatDate } from "@/utils/formatDate";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { DataTable, Column, SortConfig } from "@/components/helpers/dataTable";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT: GamesApi = new GamesApi(
	undefined,
	CFG.apiURL.toString(),
);

// #region Types
type Game = {
	id: number;
	name: string;
	sortname: string;
	date_created: Date | null;
	difficulty: number | string;
	rating: number | string;
	rating_count: number;
};

const gameColumns: Column<Game>[] = [
	{
		key: "name",
		label: "Name",
		render: (value, row) => (
			<Link href="/game/[id]" as={`/game/${row.id}`}>
				{value}
			</Link>
		),
	},
	{
		key: "date_created",
		label: "Release Date",
		render: (value) => (value ? formatDate(value as Date) : "Unknown"),
	},
	{
		key: "difficulty",
		label: "Difficulty",
		render: (value) => value,
	},
	{ key: "rating", label: "Rating", render: (value) => value },
	{ key: "rating_count", label: "# of Ratings" },
];
// #endregion

// #region Component
/*
 * The search component of the site.
 * @constructor
 * @returns JSX.Element
 */
export default function Search(): JSX.Element {
	const [games, setGames] = useState<Game[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig<Game> | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [initialized, setInitialized] = useState(false);

	const router = useRouter();

	const searchQuery = (router.query.q as string) ?? "";
	const activeLetter = router.isReady
		? ((router.query.l as string) ?? "")
		: undefined;
	const searchAuthor = (router.query.author as string) ?? "";
	const searchHasDownload = (router.query.hasDownload as string) ?? "";
	const searchCreatedFrom = (router.query.createdFrom as string) ?? "";
	const searchCreatedTo = (router.query.createdTo as string) ?? "";
	const searchRatingFrom = (router.query.ratingFrom as string) ?? "";
	const searchRatingTo = (router.query.ratingTo as string) ?? "";
	const searchDifficultyFrom = (router.query.difficultyFrom as string) ?? "";
	const searchDifficultyTo = (router.query.difficultyTo as string) ?? "";
	const searchTags = (router.query.tags as string) ?? "";

	const handleLetterNavigation = (letter: string) => {
		const query: Record<string, string> = {};
		if (searchQuery.trim()) query.q = searchQuery.trim();
		if (searchAuthor.trim()) query.author = searchAuthor.trim();
		if (searchHasDownload.trim()) query.hasDownload = searchHasDownload.trim();
		if (searchCreatedFrom.trim()) query.createdFrom = searchCreatedFrom.trim();
		if (searchCreatedTo.trim()) query.createdTo = searchCreatedTo.trim();
		if (searchRatingFrom.trim()) query.ratingFrom = searchRatingFrom.trim();
		if (searchRatingTo.trim()) query.ratingTo = searchRatingTo.trim();
		if (searchDifficultyFrom.trim()) query.difficultyFrom = searchDifficultyFrom.trim();
		if (searchDifficultyTo.trim()) query.difficultyTo = searchDifficultyTo.trim();
		if (searchTags.trim()) query.tags = searchTags.trim();

		query.l = letter === "ALL" ? "ALL" : letter;
		router.push({ pathname: "/search", query });
	};

	const clearSearch = () => {
		router.push({ pathname: "/search" });
	};

	const fetchGames = useCallback(
		async (
			requestedPage: number,
			sort: SortConfig<Game> | null,
		): Promise<Game[]> => {
			try {
				const res = await GAMES_API_CLIENT.getGames(
					undefined, // authorization
					searchQuery === "" ? undefined : searchQuery, // query
					undefined, // id
					undefined, // removed
					undefined, // name
					activeLetter === "ALL" || !activeLetter ? undefined : activeLetter, // nameStartsWith,
					undefined, // nameExp
					searchTags === "" ? undefined : searchTags, // tags
					searchAuthor === "" ? undefined : searchAuthor, // author
					undefined, // ownerUserID
					searchHasDownload === "" ? undefined : Boolean(searchHasDownload), // hasDownload
					searchCreatedFrom === "" ? undefined : new Date(searchCreatedFrom), // createdFrom
					searchCreatedTo === "" ? undefined : new Date(searchCreatedTo), // createdTo
					undefined, // clearedByUserID
					undefined, // reviewedByUserID
					searchRatingFrom === "" ? undefined : Number(searchRatingFrom), // ratingFrom
					searchRatingTo === "" ? undefined : Number(searchRatingTo), // ratingTo
					searchDifficultyFrom === "" ? undefined : Number(searchDifficultyFrom), // difficultyFrom
					searchDifficultyTo === "" ? undefined : Number(searchDifficultyTo), // difficultyTo
					requestedPage, // page number
					50, // limit
					sort?.column === "name" ? "sortname" : sort?.column, // orderCol
					sort?.direction, // orderDir
				);

				let newData: Game[] = (res.data ?? []).map((g: any) => ({
					id: Number(g.id),
					name: g.name,
					sortname: g.sortname,
					date_created: g.date_created ? new Date(g.date_created) : null,
					difficulty:
						g.difficulty === null ? "N/A" : Number(g.difficulty).toFixed(1),
					rating: g.rating === null ? "N/A" : Number(g.rating / 10).toFixed(1),
					rating_count: Number(g.rating_count),
				}));

				return newData;
			} catch (error) {
				return [];
			}
		},
		[
			searchQuery,
			activeLetter,
			searchAuthor,
			searchHasDownload,
			searchCreatedFrom,
			searchCreatedTo,
			searchRatingFrom,
			searchRatingTo,
			searchDifficultyFrom,
			searchDifficultyTo,
			searchTags
		],
	);

	useEffect(() => {
		if (!router.isReady) return;

		const hasFilters = [
			searchQuery,
			activeLetter,
			searchAuthor,
			searchTags,
			searchHasDownload,
			searchCreatedFrom,
			searchCreatedTo,
			searchRatingFrom,
			searchRatingTo,
			searchDifficultyFrom,
			searchDifficultyTo,
		].some((value) => value.trim() !== "");

		if (!hasFilters) {
			setGames([]);
			setHasMore(false);
			return;
		}

		let isCancelled = false;

		const fetchAndSet = async () => {
			const firstPage = await fetchGames(0, sortConfig);
			if (!isCancelled) {
				setGames(firstPage);
				setPage(0);
				setHasMore(firstPage.length > 0);
				setInitialized(true);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup useEffect
		};
	}, [
			searchQuery,
			activeLetter,
			searchAuthor,
			searchTags,
			searchHasDownload,
			searchCreatedFrom,
			searchCreatedTo,
			searchRatingFrom,
			searchRatingTo,
			searchDifficultyFrom,
			searchDifficultyTo,
			sortConfig,
			router.isReady,
			fetchGames
		]);

	const loadMore = async () => {
		const nextPage = page + 1;
		const moreGames = await fetchGames(nextPage, sortConfig);

		if (moreGames.length === 0) {
			setHasMore(false);
			return;
		}

		setGames((prev) => dedupeArray([...prev, ...moreGames], (g) => g.id));
		setPage(nextPage);
	};

	const loaderRef = useInfiniteScroll<HTMLDivElement>(
		() => { if (hasMore) loadMore(); },
		{ enabled: initialized }
	);

	return (
		<div
			id="content"
			className="px-4 sm:px-6 lg:px-8 min-h-screen scrollbar-gutter-stable"
		>
			<h2>Full Fangame List</h2>

			{/* Letter Navigation */}
			<p>Choose a letter to get fangames starting with that letter:</p>
			<p className="flex flex-wrap gap-1">
				{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
					<span
						role="button"
						key={letter}
						onClick={() => handleLetterNavigation(letter)}
						className={`text-[#483D8B] underline hover:text-[#1E90FF] cursor-pointer ${
							activeLetter === letter ? "font-bold" : ""
						}`}
					>
						{letter}
					</span>
				))}
				<span
					role="button"
					onClick={() => handleLetterNavigation("ALL")}
					className={`text-[#483D8B] underline hover:text-[#1E90FF] cursor-pointer ${
						!activeLetter ? "font-bold" : ""
					}`}
				>
					ALL
				</span>
				<button
					type="button"
					onClick={() => clearSearch()}
					className="font-bold cursor-pointer ml-auto"
				>
					CLEAR
				</button>
			</p>

			<p className="!font-bold mb-2">
				Showing results...
				<br/>
				{activeLetter && (
					<>
						<span className="ml-[1em]">
							Starting with: "{activeLetter}"
						</span>
						<br/>
					</>
				)}
				{searchQuery && (
					<>
						<span className="ml-[1em]">
							Containing: "{searchQuery}"
						</span>
						<br/>
					</>
				)}
				{searchAuthor && (
					<>
						<span className="ml-[1em]">
							By: "{searchAuthor}"
						</span>
						<br/>
					</>
				)}
				{(searchCreatedFrom || searchCreatedTo) && (
					<>
						<span className="ml-[1em]">
							Created between: {searchCreatedFrom === "" ? "any" : searchCreatedFrom}`
						</span>
						<span> - </span>
						<span className="ml-1">
							{searchCreatedTo === "" ? "any" : searchCreatedTo}
						</span>
						<br/>
					</>
				)}
				{(searchRatingFrom || searchRatingTo) && (
					<>
						<span className="ml-[1em]">
							Rating: [{searchRatingFrom === "" ? "any" : searchRatingFrom}
						</span>
						<span> - </span>
						<span className="ml-1">
							{searchRatingTo === "" ? "any" : searchRatingTo}]
						</span>
						<br/>
					</>
				)}
				{(searchDifficultyFrom || searchDifficultyTo) && (
					<>
						<span className="ml-[1em]">
							Difficulty: [{searchDifficultyFrom === "" ? "any" : searchDifficultyFrom}
						</span>
						<span> - </span>
						<span className="ml-1">
							{searchDifficultyTo === "" ? "any" : searchDifficultyTo}]
						</span>
						<br/>
					</>
				)}
				{searchTags && (
					<>
						<span className="ml-[1em]">
							Tagged as: "{searchTags}"
						</span>
						<br/>
					</>
				)}
				<span className="ml-[1em]">
					({games.length} {games.length === 1 ? "result" : "results"})
				</span>
			</p>

			<div className="overflow-x-auto">
				<DataTable
					data={games}
					columns={gameColumns}
					sortConfig={sortConfig}
					onSortChange={setSortConfig}
				/>
				{/* Infinite scroll trigger */}
				{loaderRef && hasMore ? (
					<div ref={loaderRef} className="h-10" />
				) : (
					<span>No more results.</span>
				)}
			</div>
		</div>
	);
}

function setErrorMessage(arg0: string) {
	throw new Error("Function not implemented.");
}
// #endregion
