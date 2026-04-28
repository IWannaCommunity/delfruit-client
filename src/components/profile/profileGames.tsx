import type { Game, UserExt } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	type Column,
	DataTable,
	type SortConfig,
} from "@/components/helpers/dataTable";
import { API } from "@/utils/api";
import { dedupeArray } from "@/utils/dedupeArray";
import type { AnyElem } from "@/utils/element";
import { useInfiniteScroll } from "@/utils/infiniteScroll";

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

const gameColumns: Column<
	Game & { rating_count: number; difficulty: number; rating: number }
>[] = [
	{
		key: "name",
		label: "Game",
		render: (value, row) => (
			<Link href="/game/[id]" as={`/game/${row.id}`}>
				{value}
			</Link>
		),
	},
	{
		key: "difficulty",
		label: "Difficulty",
		render: (value) => (value === null ? "N/A" : Number(value).toFixed(1)),
	},
	{
		key: "rating",
		label: "Rating",
		render: (value) => (value === null ? "N/A" : Number(value / 10).toFixed(1)),
	},
	{ key: "rating_count", label: "# of Ratings", render: (value) => value },
];

export default function ProfileGames({ user }: UserInfoProps): AnyElem {
	const [games, setGames] = useState<
		Array<Game & { rating_count: number; difficulty: number; rating: number }>
	>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig<
		Game & { rating_count: number; difficulty: number; rating: number }
	> | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [initialized, setInitialized] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const fetchGames = useCallback(
		async (
			requestedPage: number,
			sort: SortConfig<
				Game & { rating_count: number; difficulty: number; rating: number }
			> | null,
		): Promise<
			Array<Game & { rating_count: number; difficulty: number; rating: number }>
		> => {
			const res = (await API.lists().getGamesByOwner(
				user.id, // id
			)) as Array<
				Game & { rating_count: number; difficulty: number; rating: number }
			>;

			const newData: Array<
				Game & { rating_count: number; difficulty: number; rating: number }
			> = (res.data ?? []).map(
				(
					r: Game & {
						rating_count: number;
						difficulty: number;
						rating: number;
					},
				) => ({
					id: Number(r.id),
					name: r.name,
					difficulty: r.difficulty,
					rating: r.rating,
					rating_count: r.rating_count,
				}),
			);

			return newData;
		},
		[user.id],
	);

	useEffect(() => {
		let isCancelled = false;
		setInitialized(false);

		const fetchAndSet = async () => {
			const firstPage = await fetchGames(0, sortConfig);
			if (!isCancelled) {
				setGames(firstPage);
				setPage(0);
				setHasMore(firstPage.length === 50);
				setInitialized(true);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup
		};
	}, [sortConfig, fetchGames]);

	const loadMore = async () => {
		if (isLoadingMore) return;
		setIsLoadingMore(true);

		const nextPage = page + 1;
		const moreRatings = await fetchGames(nextPage, sortConfig);

		if (moreRatings.length === 0) {
			setHasMore(false);
			setIsLoadingMore(false);
			return;
		}

		setGames((prev) => dedupeArray([...prev, ...moreRatings], (r) => r.id));
		setPage(nextPage);
		setIsLoadingMore(false);
	};

	const loaderRef = useInfiniteScroll<HTMLDivElement>(
		() => {
			if (hasMore) loadMore();
		},
		{ enabled: initialized },
	);

	return (
		<div className="px-[1.5em]">
			<p className="text-[#222222]">{games.length} Games</p>
			<div className="overflow-x-auto">
				<DataTable
					data={games}
					columns={gameColumns}
					sortConfig={sortConfig}
					onSortChange={setSortConfig}
				/>
				{/* Infinite scroll trigger */}
				{hasMore ? (
					<div
						ref={loaderRef}
						className="flex justify-center items-center h-16"
					>
						{isLoadingMore && (
							<div className="animate-pulse text-blue-500">Loading...</div>
						)}
					</div>
				) : (
					<div
						ref={loaderRef}
						className="flex justify-center items-center h-16"
					>
						<span>No more results.</span>
					</div>
				)}
			</div>
		</div>
	);
}
