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
import { useSessionContext } from "@/utils/hooks";
import { useInfiniteScroll } from "@/utils/infiniteScroll";

type UserInfoProps = {
	user: UserExt;
};

type UserProfile = {
	userId: number;
	name: string;
};

const userProfileColumns: Column<UserProfile>[] = [
	{
		key: "name",
		label: "Name",
		render: (value, row) => (
			<Link href="/profile/[id]" as={`/profile/${row.userId}`}>
				{value}
			</Link>
		),
	},
];

export default function ProfileFollowing({ user }: UserInfoProps): JSX.Element {
	const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig<UserProfile> | null>(
		null,
	);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [initialized, setInitialized] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [session] = useSessionContext();

	const fetchFollowing = useCallback(
		async (
			requestedPage: number,
			sort: SortConfig<UserProfile> | null,
		): Promise<UserProfile[]> => {
			const res = await API.lists().getFollowingUsers(
				`Bearer ${session.token}`,
				0,
			);

			const newData: UserProfile[] = (res.data ?? []).map((r: any) => ({
				userId: Number(r.userId),
				name: r.name,
			}));
			console.log(newData);

			return newData;
		},
		[user.id],
	);

	useEffect(() => {
		let isCancelled = false;
		setInitialized(false);

		const fetchAndSet = async () => {
			const firstPage = await fetchFollowing(0, sortConfig);
			if (!isCancelled) {
				setUserProfiles(firstPage);
				setPage(0);
				setHasMore(firstPage.length === 50);
				setInitialized(true);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup
		};
	}, [sortConfig, fetchFollowing]);

	const loadMore = async () => {
		if (isLoadingMore) return;
		setIsLoadingMore(true);

		const nextPage = page + 1;
		const moreRatings = await fetchFollowing(nextPage, sortConfig);

		if (moreRatings.length === 0) {
			setHasMore(false);
			setIsLoadingMore(false);
			return;
		}

		setUserProfiles((prev) =>
			dedupeArray([...prev, ...moreRatings], (r) => r.userId),
		);
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
			<p className="text-[#222222]">{userProfiles.length} Users</p>
			<div className="overflow-x-auto">
				<DataTable
					data={userProfiles}
					columns={userProfileColumns}
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
