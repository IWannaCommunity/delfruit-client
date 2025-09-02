import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";
import { UsersApi } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { AnyElem } from "@/utils/element";
import { DataTable, Column, SortConfig } from "@/components/helpers/dataTable";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT: UsersApi = new UsersApi(undefined, CFG.apiURL.toString());

type User = {
	id: number;
	name: string;
	dateCreated: Date | null;
	twitchLink: string;
	youtubeLink: string;
	twitterLink: string;
};

const userColumns: Column<User>[] = [
	{
		key: "name",
		label: "Username",
		render: (value, row) => (
			<Link href={`/user/${row.id}`}>
				{value}
			</Link>
		),
	},
	{
		key: "dateCreated",
		label: "Account Created",
		render: (value) => (value ? formatDate(value as Date) : "Unknown"),
	},
];

export default function UserList(): AnyElem {
	const [users, setUsers] = useState<User[]>([]);
	const [sortConfig, setSortConfig] = useState<SortConfig<User> | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const router = useRouter();
	
	const fetchUsers = useCallback(
		async (requestedPage: number, sort: SortConfig<User> | null): Promise<User[]> => {
			const res = await USERS_API_CLIENT.getUsers(
				undefined, // authorization
				undefined, // name
				undefined, // following
				undefined, // banned
				requestedPage, // page number
				50, // limit
			);

			const newData: User[] = (res.data ?? []).map((u: any) => ({
				id: Number(u.id),
				name: u.name,
				dateCreated: u.dateCreated ? new Date(u.dateCreated) : null,
				twitchLink: u.twitchLink,
				youtubeLink: u.youtubeLink,
				twitterLink: u.twitterLink,
			}));

			return newData;
		},
		[]
	);
	
	useEffect(() => {
		if (!router.isReady) return;

		let isCancelled = false;

		const fetchAndSet = async () => {
			const firstPage = await fetchUsers(0, sortConfig);
			if (!isCancelled) {
				setUsers(firstPage);
				setPage(0);
				setHasMore(firstPage.length > 0);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup
		};
	}, [sortConfig, router.isReady, fetchUsers]);

	const loadMore = async () => {
		const nextPage = page + 1;
		const moreUsers = await fetchUsers(nextPage, sortConfig);

		if (moreUsers.length === 0) {
			setHasMore(false);
			return;
		}

		setUsers((prev) => dedupeArray([...prev, ...moreUsers], (u) => u.id));
		setPage(nextPage);
	};
	
	const loaderRef = useInfiniteScroll<HTMLDivElement>(() => {
		if (hasMore) loadMore();
	});

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content" className="px-4 sm:px-6 lg:px-8 min-h-screen scrollbar-gutter-stable">
					<h2>User List</h2>

					<DataTable
						data={users}
						columns={userColumns}
						sortConfig={sortConfig}
						onSortChange={setSortConfig}
						loaderRef={loaderRef}
					/>
				</div>
				<Footer />
			</div>
		</div>
	);
}
