import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useInfiniteScroll } from "../utils/infiniteScroll";
import { GamesApi } from "delfruit-swagger-cg-sdk";

const CFG: Config = require("../config.json");
const GAMES_API_CLIENT: GamesApi = new GamesApi(void 0, CFG.apiURL.toString());

/* --------------------------------------------------------
 * Types
 * ------------------------------------------------------ */
type Game = {
  id: number;
  name: string;
  date_created: string;
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

/* --------------------------------------------------------
 * Date Formatter
 * ------------------------------------------------------ */
const dateCache: Record<string, number> = {};
const getTimestamp = (dateString: string): number => {
  if (!dateCache[dateString]) {
    dateCache[dateString] = new Date(dateString.replace(" ", "T")).getTime();
  }
  return dateCache[dateString];
};

const formatDate = (dateString: string): string => {
  const parsed = new Date(dateString.replace(" ", "T"));
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
};

/* --------------------------------------------------------
 * Letter Filtering Logic
 * ------------------------------------------------------ */
const matchesLetterFilter = (gameName: string, letter: string): boolean => {
  const lowerName = gameName.toLowerCase().trim();
  const lowerLetter = letter.toLowerCase();
	
	if (lowerLetter === "b") {
		return (
			(lowerName.startsWith("i wanna b") && !lowerName.startsWith("i wanna be")) ||
			lowerName.startsWith("i wanna be the b") ||
			lowerName.startsWith(lowerLetter)
		);
	}

  if (lowerLetter === "i") {
    return (
      lowerName.startsWith("i wanna i") ||
      lowerName.startsWith("i wanna be the i") ||
      (lowerName.startsWith("i ") && !lowerName.startsWith("i wanna"))
    );
  }

  // Normal case
  return (
    lowerName.startsWith(`i wanna ${lowerLetter}`) ||
    lowerName.startsWith(`i wanna be the ${lowerLetter}`) ||
    lowerName.startsWith(lowerLetter)
  );
};

/* --------------------------------------------------------
 * Sorting/Cache Hook - ABANDONED FOR SERVER SIDE CODING
 * ------------------------------------------------------ */
 /*
type SortCache = Map<string, Game[]>;
const MAX_CACHE = 5;

const useSortedGames = (
  games: Game[],
  sortConfig: SortConfig | null,
  sortCache: React.MutableRefObject<SortCache>
) => {
  return useMemo(() => {
		sortCache.current.clear();
		
    if (!sortConfig) return [...games];

    const key = `${sortConfig.column}-${sortConfig.direction}`;
    if (sortCache.current.has(key)) {
      const cached = sortCache.current.get(key)!;
      sortCache.current.delete(key);
      sortCache.current.set(key, cached);
      return cached;
    }

    const { column, direction } = sortConfig;
    const sorted = [...games].sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (column === "date_created") {
        const timeA = getTimestamp(valA as string);
        const timeB = getTimestamp(valB as string);
        return direction === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return direction === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    // Cache the result
    sortCache.current.set(key, sorted);
    if (sortCache.current.size > MAX_CACHE) {
      const oldestKey = sortCache.current.keys().next().value;
      sortCache.current.delete(oldestKey);
    }

    return sorted;
  }, [games, sortConfig]);
};
*/
/* --------------------------------------------------------
 * Component
 * ------------------------------------------------------ */
export default function Search(): JSX.Element {
  const [games, setGames] = useState<Game[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  const searchQuery = (router.query.s as string) ?? "";
  const activeLetter = (router.query.q as string) ?? "";

  const handleLetterNavigation = (letter: string) => {
    const query: Record<string, string> = {};
    if (searchQuery.trim()) query.s = searchQuery.trim();

    if (letter !== "ALL") {
      query.q = letter;
    } else {
			query.q = "ALL";
		}
    router.push({ pathname: "/search", query });
  };
	
	const dedupeGames = (games: Game[]): Game[] => {
		return Array.from(new Map(games.map((g) => [g.id, g])).values());
	};

	const fetchGames = async (
    requestedPage: number,
    sort: SortConfig | null
  ): Promise<Game[]> => {
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
      sort?.column, // orderCol
      sort?.direction // orderDir
    );

    let newData: Game[] = (res.data ?? []).map((g: any) => ({
      id: Number(g.id),
      name: g.name,
      date_created: g.date_created,
      difficulty: Number(g.difficulty),
      rating: Number(g.rating),
      rating_count: Number(g.rating_count),
    }));
		
		if (activeLetter.trim() && activeLetter !== "ALL") {
			newData = newData.filter((g) =>
				matchesLetterFilter(g.name, activeLetter)
			);
		}
		
		return newData;
	};
			
	useEffect(() => {
		if (!router.isReady) return;

		if (!searchQuery.trim() && !activeLetter.trim()) {
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
			}
		};
		
		fetchAndSet();
		
		return () => {
			isCancelled = true; // cleanup useEffect
		};
	
  }, [searchQuery, activeLetter, sortConfig, router.isReady]);
	
	const loadMore = async () => {
    const nextPage = page + 1;
    const moreGames = await fetchGames(nextPage, sortConfig);

    if (moreGames.length === 0) {
      setHasMore(false);
      return;
    }

    setGames((prev) => dedupeGames([...prev, ...moreGames]));
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
        direction: sortConfig.direction === "asc" ? "desc" : "asc"
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
				<span className="ml-[1em]">{activeLetter && ` Starting with "${activeLetter}"`}</span>
        <span className="ml-[1em]">{searchQuery && ` Containing "${searchQuery}"`}</span>
        <span className="ml-[1em]">({games.length}{" "} {games.length === 1 ? "result" : "results"})</span>
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
            {games.map((game) => (
              <tr key={game.id}>
                <td className="!max-w-[15em] break-words">
                  <a href={`/game/${game.id}`}>{game.name}</a>
                </td>
                <td className="rating">{game.date_created ? formatDate(game.date_created) : "Unknown"}</td>
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