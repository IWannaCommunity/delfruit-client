import type { UserExt } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	type Column,
	DataTable,
	type SortConfig,
} from "@/components/helpers/dataTable";
import { API } from "@/utils/api";
import { dedupeArray } from "@/utils/dedupeArray";
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
		render: (value) => value,
	},
	{
		key: "rating",
		label: "Rating",
		render: (value) => value,
	},
];

export default function ProfileClears({ user }: UserInfoProps): JSX.Element {
	const [ratings, setRatings] = useState<Rating[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig<Rating> | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [initialized, setInitialized] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const fetchClears = useCallback(
		async (
			requestedPage: number,
			sort: SortConfig<Rating> | null,
		): Promise<Rating[]> => {
			const res = await API.lists().getClearListGames(
				user.id, // id
			);

			const newData: Rating[] = (res.data ?? []).map((r: any) => ({
				id: Number(r.id),
				game_id: Number(r.gameId),
				game_name: r.gameName,
				difficulty:
					r.difficulty === null ? "N/A" : Number(r.difficulty).toFixed(1),
				rating: r.rating === null ? "N/A" : Number(r.rating / 10).toFixed(1),
			}));

			return newData;
		},
		[user.id],
	);

	useEffect(() => {
		let isCancelled = false;
		setInitialized(false);

		const fetchAndSet = async () => {
			const firstPage = await fetchClears(0, sortConfig);
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
	}, [sortConfig, fetchClears]);

	const loadMore = async () => {
		if (isLoadingMore) return;
		setIsLoadingMore(true);

		const nextPage = page + 1;
		const moreRatings = await fetchClears(nextPage, sortConfig);

		if (moreRatings.length === 0) {
			setHasMore(false);
			setIsLoadingMore(false);
			return;
		}

		setRatings((prev) => dedupeArray([...prev, ...moreRatings], (r) => r.id));
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
			<p className="text-[#222222]">{ratings.length} Games</p>
			<div className="overflow-x-auto">
				<DataTable
					data={ratings}
					columns={ratingColumns}
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
