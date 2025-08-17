import React, { useState, useMemo, useRef } from "react";
import { useInfiniteScroll } from "../utils/infiniteScroll";

/* --------------------------------------------------------
 * Types
 * ------------------------------------------------------ */
type Game = {
  id: number;
  Game: string;
  ReleaseDate: string;
  Difficulty: number;
  Ratings: number;
  RatingCount: number;
};

type SortConfig = { column: keyof Game; direction: "asc" | "desc" };

/* --------------------------------------------------------
 * Mock Data (NOTE: Math.floor causes hydration error, ignore for testing)
 * ------------------------------------------------------ */
const allGames: Game[] = Array.from({ length: 20000 }, (_, i) => {
  const year = 2007 + Math.floor(Math.random() * 20);
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  const second = String(Math.floor(Math.random() * 60)).padStart(2, "0");

  const ReleaseDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return {
    id: i + 1,
    Game: `I wanna be the ${String.fromCharCode(65 + (i % 26))}${i}`,
    ReleaseDate,
    Difficulty: (i % 100) + Math.random(),
    Ratings: (i % 10) + Math.random(),
    RatingCount: i,
  };
});

const columns = [
  { key: "Game", label: "Game" },
  { key: "ReleaseDate", label: "Release Date" },
  { key: "Difficulty", label: "Difficulty" },
  { key: "Ratings", label: "Ratings" },
  { key: "RatingCount", label: "# of Ratings" },
];

/* --------------------------------------------------------
 * Date Helpers - Cache timestamps to avoid repeated parsing
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
 * Sorting/Cache Logic
 * ------------------------------------------------------ */
type SortCache = Map<string, Game[]>;
const MAX_CACHE = 5;

const useSortedGames = (
  games: Game[],
  sortConfig: SortConfig | null,
  sortCache: React.MutableRefObject<SortCache>
) => {
  return useMemo(() => {
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

      if (column === "ReleaseDate") {
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

    sortCache.current.set(key, sorted);
    if (sortCache.current.size > MAX_CACHE) {
      const oldestKey = sortCache.current.keys().next().value;
      sortCache.current.delete(oldestKey);
    }

    return sorted;
  }, [games, sortConfig]);
};

/* --------------------------------------------------------
 * Component
 * ------------------------------------------------------ */
export default function Search(): JSX.Element {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(1);

  const sortCache = useRef<SortCache>(new Map());
  const sortedAllGames = useSortedGames(allGames, sortConfig, sortCache);
  const visibleGames = useMemo(
    () => sortedAllGames.slice(0, page * 20),
    [sortedAllGames, page]
  );

  const loaderRef = useInfiniteScroll<HTMLDivElement>(() => setPage((p) => p + 1));

  const handleSort = (column: keyof Game) => {
    if (sortConfig?.column === column) {
      setSortConfig({
        column,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ column, direction: "asc" });
    }
    setPage(1);
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

      <p className="!font-bold mb-2">
        Showing search results for: [game name here] ({sortedAllGames.length} results)
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
                  style={{ backgroundImage: `url(${getSortIcon(key as keyof Game)})` }}
                  onClick={() => handleSort(key as keyof Game)}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleGames.map((game) => (
              <tr key={game.id}>
                <td className="!max-w-[15em] break-words">
                  <a href="/game">{game.Game}</a>
                </td>
                <td className="rating">{formatDate(game.ReleaseDate)}</td>
                <td className="rating">{game.Difficulty.toFixed(1)}</td>
                <td className="rating">{game.Ratings.toFixed(1)}</td>
                <td className="rating">{game.RatingCount}</td>
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