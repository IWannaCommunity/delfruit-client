import { useRouter } from "next/router";
import React, {
	useEffect,
	useState,
	useMemo,
	useRef,
	useCallback,
} from "react";
import { useInfiniteScroll } from "../utils/infiniteScroll";
import { formatDate } from "../utils/formatDate";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";

const CFG: Config = require("../config.json");
const GAMES_API_CLIENT: GamesApi = new GamesApi(undefined, CFG.apiURL.toString());

// #region Types
type Game = {
	id: number;
	name: string;
	date_created: Date | null;
	difficulty: number;
	rating: number;
	rating_count: number;
};

type SortConfig = { column: keyof Game; direction: "asc" | "desc" };

const columns = [
	{ key: "name", label: "Game" },
	{ key: "date_created", label: "Release Date" },
	{ key: "difficulty", label: "Difficulty" },
	{ key: "rating", label: "Rating" },
	{ key: "rating_count", label: "# of Ratings" },
];
// #endregion

// #region Letter Filtering Logic
const matchesLetterFilter = (gameName: string, letter: string): boolean => {
	const lowerName = gameName.toLowerCase().trim();
	const lowerLetter = letter.toLowerCase();

	return lowerName.startsWith(lowerLetter);
};
// #endregion

// #region Component
/*
 * The search component of the site.
 * @constructor
 * @returns JSX.Element
 */
export default function Search(): JSX.Element {
	const [games, setGames] = useState<Set<Game>>(new Set());
	const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();

	const searchQuery = (router.query.s as string) ?? "";
	const activeLetter = (router.query.q as string) ?? "";

	const handleLetterNavigation = (letter: string) => {
		const query: Record<string, string> = {};
		if (searchQuery.trim()) query.s = searchQuery.trim();

		query.q = (letter === "ALL") ? "ALL" : letter;
		router.push({ pathname: "/search", query });
	};

	const dedupeGames = (games: Game[]): Game[] => {
		return Array.from(new Map(games.map((g) => [g.id, g])).values());
	};

	// NOTE: Letter filtering/sorting is currently broken until there is a backend fix
	const fetchGames = useCallback(
		async (requestedPage: number, sort: SortConfig | null): Promise<Game[]> => {
			const res = await GAMES_API_CLIENT.getGames(
				undefined, // authorization
				undefined, // id
				undefined, // removed
				searchQuery || undefined, // name
				undefined, // tags
				undefined, // author
				undefined, // ownerUserID
				undefined, // hasDownload
				undefined, // createdFrom
				undefined, // createdTo
				undefined, // clearedByUserID
				undefined, // reviewedByUserID
				undefined, // ratingFrom
				undefined, // ratingTo
				undefined, // difficultyFrom
				undefined, // difficultyTo
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
				difficulty: Number(g.difficulty),
				rating: Number(g.rating),
				rating_count: Number(g.rating_count),
			}));

			if (activeLetter.trim() && activeLetter !== "ALL") {
				newData = newData.filter((g) =>
					matchesLetterFilter(g.sortname, activeLetter),
				);
			}

			return newData;
		},
		[activeLetter, searchQuery],
	);

	useEffect(() => {
		if (!router.isReady) return;

		if (!searchQuery.trim() && !activeLetter.trim()) {
			setGames(new Set());
			setHasMore(false);
			return;
		}

		let isCancelled = false;

		const fetchAndSet = async () => {
			const firstPage = await fetchGames(0, sortConfig);
			if (!isCancelled) {
				setGames(new Set(firstPage));
				setPage(0);
				setHasMore(firstPage.length > 0);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup useEffect
		};
	}, [searchQuery, activeLetter, sortConfig, router.isReady, fetchGames]);

	const loadMore = async () => {
		const nextPage = page + 1;
		const moreGames = await fetchGames(nextPage, sortConfig);

		if (moreGames.length === 0) {
			setHasMore(false);
			return;
		}
		
		setGames((prev) => new Set([...prev, ...moreGames]));
		setPage(nextPage);
	};

	const loaderRef = useInfiniteScroll<HTMLDivElement>(() => {
		if (hasMore) loadMore();
	});

	/*
  const sortCache = useRef<SortCache>(new Map());
  const sortedGames = useSortedGames(games, sortConfig, sortCache);
    */

	const handleSort = (column: keyof Game) => {
		if (sortConfig?.column === column) {
			setSortConfig({
				column,
				direction: sortConfig.direction === "asc" ? "desc" : "asc",
			});
		} else {
			setSortConfig({ column, direction: "asc" });
		}
		setPage(0);
	};

	const getSortIcon = (column: keyof Game) => {
		if (sortConfig?.column !== column) return "/images/bg.gif";
		return sortConfig.direction === "asc"
			? "/images/asc.gif"
			: "/images/desc.gif";
	};

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
			</p>

			<p className="!font-bold mb-2">
				Showing search results:
				<span className="ml-[1em]">
					{activeLetter && ` Starting with "${activeLetter}"`}
				</span>
				<span className="ml-[1em]">
					{searchQuery && ` Containing "${searchQuery}"`}
				</span>
				<span className="ml-[1em]">
					({games.size} {games.size === 1 ? "result" : "results"})
				</span>
			</p>

			<div className="overflow-x-auto">
				<table className="tablesorter min-w-[600px] w-full">
					<thead>
						<tr>
							{columns.map(({ key, label }) => (
								<th
									key={key}
									className={`cursor-pointer ${
										sortConfig?.column === key ? "bg-[#8DBDD8]" : "bg-[#E6EEEE]"
									} bg-right bg-no-repeat`}
									style={{
										backgroundImage: `url(${getSortIcon(key as keyof Game)})`,
									}}
									onClick={() => handleSort(key as keyof Game)}
								>
									{label}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{[...games].map((game) => (
							<tr key={game.id}>
								<td className="!max-w-[15em] break-words">
									<Link href="/game/[id]" as={`/game/${game.id}`}>
										{game.name}
									</Link>
								</td>
								<td className="rating">
									{game.date_created
										? formatDate(game.date_created)
										: "Unknown"}
								</td>
								<td className="rating">{game.difficulty.toFixed(1)}</td>
								<td className="rating">{game.rating.toFixed(1)}</td>
								<td className="rating">{game.rating_count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Infinite scroll loader trigger */}
			<div ref={loaderRef} className="h-10" />
		</div>
	);
}
// #endregion
