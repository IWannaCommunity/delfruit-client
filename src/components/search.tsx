import React, { useState, useMemo, useEffect, useRef } from "react";

/* --------------------------------------------------------
 * Type Definitions
 * --------------------------------------------------------
 * Define the data structure for each game entry.
 */
type Game = {
  id: number;
  Game: string;
  ReleaseDate: string; // stored as "YYYY-MM-DD HH:MM:SS"
  Difficulty: number;
  Ratings: number;
  RatingCount: number;
};

/* --------------------------------------------------------
 * Mock Data Generator
 * --------------------------------------------------------
 * - Each game has a randomized release date in format
 *   "YYYY-MM-DD HH:MM:SS".
 * - Difficulty, Ratings, and RatingCount are randomized
 *   for testing infinite scrolling and sorting.
 * - NOTE: Calling math.random() here at module load time
		 causes a hydration error on reload 
		 due to a mismatch in values. Ignore this error for now
		 since it is only here for testing purposes.
 */
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

/* --------------------------------------------------------
 * Table Column Definitions
 * --------------------------------------------------------
 * Key matches data field in `Game`.
 */
const columns = [
  { key: "Game", label: "Game" },
  { key: "ReleaseDate", label: "Release Date" },
  { key: "Difficulty", label: "Difficulty" },
  { key: "Ratings", label: "Ratings" },
  { key: "RatingCount", label: "# of Ratings" },
];

/* --------------------------------------------------------
 * Sorting Configuration Type
 * --------------------------------------------------------
 * column = dataset field (keyof Game)
 * direction = "asc" | "desc"
 */
type SortConfig = { column: keyof Game; direction: "asc" | "desc" };

/* --------------------------------------------------------
 * Date Parsing and Formatting
 * --------------------------------------------------------
 * - Cache timestamps to avoid repeated parsing
 * - Format dates as "MMM DD, YYYY"
 */
const dateCache: Record<string, number> = {};
const getTimestamp = (dateString: string): number => {
  if (!dateCache[dateString]) {
    dateCache[dateString] = new Date(dateString.replace(" ", "T")).getTime();
  }
  return dateCache[dateString];
};

const formatDate = (dateString: string) => {
  const parsed = new Date(dateString.replace(" ", "T"));
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
};

/* --------------------------------------------------------
 * Main Component
 * --------------------------------------------------------
 * Includes:
 * - Responsive layout
 * - Infinite scroll (IntersectionObserver)
 * - Sort caching (LRU-style)
 */
export default function Search(): JSX.Element {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(1);

  // Sort cache (LRU)
  type SortCache = Map<string, Game[]>;
  const sortCache = useRef<SortCache>(new Map());
  const MAX_CACHE = 5;

  /* --------------------------------------------------------
   * Sorting Logic
   * --------------------------------------------------------
   * - Memoized sorting of `allGames`.
   * - Uses `sortCache` to avoid re-sorting the same column/direction.
   */
  const sortedAllGames = useMemo(() => {
    if (!sortConfig) return [...allGames];

    const key = `${sortConfig.column}-${sortConfig.direction}`;
    if (sortCache.current.has(key)) {
      const result = sortCache.current.get(key)!;
      sortCache.current.delete(key); // Refresh order
      sortCache.current.set(key, result);
      return result;
    }

    const { column, direction } = sortConfig;
    const sorted = [...allGames].sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (column === "ReleaseDate") {
        const timeA = getTimestamp(valA as string);
        const timeB = getTimestamp(valB as string);
        return direction === "asc" ? timeA - timeB : timeB - timeA;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
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
  }, [sortConfig]);

  /* --------------------------------------------------------
   * Pagination (infinite scroll)
   * --------------------------------------------------------
   */
  const visibleGames = useMemo(() => {
    return sortedAllGames.slice(0, page * 20);
  }, [sortedAllGames, page]);

  /* --------------------------------------------------------
   * Sorting Handler
   * --------------------------------------------------------
   * - Toggles ASC/DESC when clicking same column
   * - Defaults to ASC when switching columns
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
    setPage(1); // Reset scroll back
  };

  /* --------------------------------------------------------
   * Header Sorting Icon
   * --------------------------------------------------------
   */
  const getSortIcon = (column: keyof Game) => {
    if (sortConfig?.column !== column) return "/images/bg.gif";
    return sortConfig.direction === "asc" ? "/images/asc.gif" : "/images/desc.gif";
  };

  /* --------------------------------------------------------
   * Infinite Scroll (IntersectionObserver)
   * --------------------------------------------------------
   */
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, []);

  /* --------------------------------------------------------
   * Render
   * --------------------------------------------------------
   */
  return (
    <div id="content" className="px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2>Full Fangame List</h2>

      {/* Letter Navigation */}
      <p>Choose a letter to get fangames starting with that letter:</p>
      <p className="flex flex-wrap gap-1">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <React.Fragment key={letter}>
            <a href="/">{letter}</a>
          </React.Fragment>
        ))}
        <a href="/">ALL</a>
      </p>

      {/* Search Info */}
      <p className="!font-bold mb-2">
        Showing search results for: [game name here] ({sortedAllGames.length} results)
      </p>

      {/* Responsive Table Wrapper */}
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