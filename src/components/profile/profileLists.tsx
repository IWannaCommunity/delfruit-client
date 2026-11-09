import type { UserExt } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	type Column,
	DataTable,
	type SortConfig,
} from "@/components/helpers/dataTable";
import { API } from "@/utils/api";
import { useSessionContext } from "@/utils/hooks";

type UserInfoProps = {
	user: UserExt;
	isOwnProfile: boolean;
};

type ListType = "favorites" | "clears" | "bookmarks";

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

const formatRatings = (data: any[]): Rating[] =>
	data.map((r) => ({
		id: Number(r.id),
		game_id: Number(r.gameId),
		game_name: r.gameName,
		difficulty:
			r.difficulty === null ? "N/A" : Number(r.difficulty).toFixed(1),
		rating:
			r.rating === null ? "N/A" : Number(r.rating / 10).toFixed(1),
	}));

export default function ProfileLists({
	user,
	isOwnProfile,
}: UserInfoProps): JSX.Element {
	const [ratings, setRatings] = useState<Rating[]>([]);
	const [selectedList, setSelectedList] = useState<ListType>("favorites");
	const [sortConfig, setSortConfig] = useState<SortConfig<Rating> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [session] = useSessionContext();

	useEffect(() => {
		let isCancelled = false;

		const fetchList = async () => {
			setLoading(true);
			setError(null);
			setRatings([]);

			try {
				let data: any[];

				switch (selectedList) {
					case "favorites": {
						const res = await API.lists().getFavoritesListGames(
							user.id,
						);
						data = res.data ?? [];
						break;
					}

					case "clears": {
						const res = await API.lists().getClearListGames(
							user.id,
						);
						data = res.data ?? [];
						break;
					}

					case "bookmarks": {
						if (!isOwnProfile || !session?.token) {
							throw new Error("Unauthorized");
						}

						const res = await API.lists().getBookmarkedGames(
							`Bearer ${session.token}`,
							0,
						);
						data = res.data ?? [];
						break;
					}

					default: {
						throw new Error("Invalid list selection");
					}
				}

				if (!isCancelled) {
					setRatings(formatRatings(data));
				}
			} catch {
				if (!isCancelled) {
					setError("Failed to load list.");
				}
			} finally {
				if (!isCancelled) {
					setLoading(false);
				}
			}
		};

		fetchList();

		return () => {
			isCancelled = true;
		};
	}, [selectedList, user.id, isOwnProfile, session?.token]);

	useEffect(() => {
		if (!isOwnProfile && selectedList === "bookmarks") {
			setSelectedList("favorites");
		}
	}, [isOwnProfile, selectedList]);

	const listName = {
		favorites: "Favorites",
		clears: "Clears",
		bookmarks: "Bookmarks",
	}[selectedList];

	return (
		<div className="px-[1.5em]">
			<div className="flex items-center justify-between gap-3 mb-3">
				<label htmlFor="profile-list-select">
					Select List:
				</label>

				<select
					id="profile-list-select"
					value={selectedList}
					onChange={(e) => {
						setSelectedList(e.target.value as ListType);
					}}
					className="max-w-full"
				>
					<optgroup label="Public">
						<option value="favorites">Favorites</option>
						<option value="clears">Clears</option>
					</optgroup>

					{isOwnProfile && (
						<optgroup label="Private">
							<option value="bookmarks">Bookmarks</option>
						</optgroup>
					)}
				</select>
			</div>

			<p className="text-[var(--color-background-tertiary)]">
				{ratings.length} Games in {listName}
			</p>

			<div className="overflow-x-auto">
				{loading ? (
					<div className="text-center py-4">
						Loading...
					</div>
				) : error ? (
					<div className="text-red-600 py-4">
						{error}
					</div>
				) : (
					<DataTable
						data={ratings}
						columns={ratingColumns}
						sortConfig={sortConfig}
						onSortChange={setSortConfig}
					/>
				)}
			</div>
		</div>
	);
}
