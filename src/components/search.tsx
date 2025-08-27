import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { formatDate } from "@/utils/formatDate";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { DataTable, Column, SortConfig } from "@/components/DataTable";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT: GamesApi = new GamesApi(undefined, CFG.apiURL.toString());

type Game = {
	id: number;
	name: string;
	date_created: Date | null;
	difficulty: number;
	rating: number;
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
    render: (value) => (value ? formatDate(value as Date) : "Unknown")
  },
	{ 
		key: "difficulty", 
		label: "Difficulty",
		render: (value) => (value.toFixed(1))
	},
	{ key: "rating", 
		label: "Rating",
		render: (value) => (value.toFixed(1))
	},
	{ key: "rating_count", 
		label: "# of Ratings"
	}
];

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
				<DataTable
					data={[...games]}
					columns={gameColumns}
					sortConfig={sortConfig}
					onSortChange={setSortConfig}
					loaderRef={loaderRef}
				/>
			</div>

			{/* Infinite scroll loader trigger */}
			<div ref={loaderRef} className="h-10" />
		</div>
	);
}
// #endregion
