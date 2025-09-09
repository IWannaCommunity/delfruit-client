import Link from "next/link";
import { DataTable, Column, SortConfig } from "@/components/helpers/dataTable";
import { API } from "@/utils/api";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";

type UserInfoProps = {
  user: UserExt;
};

type Rating = {
	id: number;
	game_id: number;
	game_name: string;
	difficulty: number | string;
	rating: number | string;
};

const ratingColumns: Column<Rating>[] = [
  {
    key: "game_name",
    label: "Game",
    render: (value, row) => (
      <Link href="/game/[id]" as={`/game/${row.game_id}`}>
        {value}
      </Link>
    ),
  },
	{ 
		key: "difficulty", 
		label: "Difficulty",
		render: (value) => (value)
	},
	{ key: "rating", 
		label: "User's Rating",
		render: (value) => (value)
	}
];

export default function UserRatings({ user }: UserInfoProps): JSX.Element {
	const [ratings, setRatings] = useState<Rating[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig<Rating> | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchRatings = useCallback(
    async (requestedPage: number, sort: SortConfig<Rating> | null): Promise<Rating[]> => {
      const res = await API.users().getUsersReviews(
        user.id, // id
        requestedPage, // page number
        50, // limit
        sort?.column, // orderCol
				sort?.direction, // orderDir
      );

      const newData: Rating[] = (res.data ?? []).map((r: any) => ({
        id: Number(r.id),
				game_id: Number(r.game_id),
        game_name: r.game_name,
        difficulty: (r.difficulty === null) ? "N/A" : Number(r.difficulty).toFixed(1),
				rating: (r.rating === null) ? "N/A" : Number(r.rating/10).toFixed(1)
      }));

      return newData;
    },
    []
  );
	
  useEffect(() => {
    let isCancelled = false;
    setInitialized(false);

    const fetchAndSet = async () => {
      const firstPage = await fetchRatings(0, sortConfig);
      if (!isCancelled) {
        setRatings(firstPage);
        setPage(0);
        setHasMore(firstPage.length === 50);
        setInitialized(true);
      }
    };

    fetchAndSet();

    return () => {
      isCancelled = true; // cleanup
    };
  }, [sortConfig, fetchRatings]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const moreRatings = await fetchRatings(nextPage, sortConfig);

    if (moreRatings.length === 0) {
      setHasMore(false);
      return;
    }

    setRatings((prev) => dedupeArray([...prev, ...moreRatings], (r) => r.id));
    setPage(nextPage);
  };
	
  const loaderRef = useInfiniteScroll<HTMLDivElement>(
		() => { if (hasMore) loadMore(); },
		{ enabled: initialized }
	);
	
	return(
		<div className="px-[1.5em]">
		<p className="text-[#222222]">{ratings.length} Games</p>
			
			<div className="overflow-x-auto">
				<DataTable
					data={ratings}
					columns={ratingColumns}
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
