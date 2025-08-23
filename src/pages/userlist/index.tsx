import Head from "next/head";
import Header from "../../components/header";
import { useRouter } from "next/router";
import React, {
	useEffect,
	useState,
	useMemo,
	useRef,
	useCallback,
} from "react";
import { useInfiniteScroll } from "../../utils/infiniteScroll";
import { UsersApi } from "delfruit-swagger-cg-sdk";
import { formatDate } from "../../utils/formatDate";
import Link from "next/link";

const CFG: Config = require("../../config.json");
const USERS_API_CLIENT: UsersApi = new UsersApi(undefined, CFG.apiURL.toString());

type User = {
	id: number;
	name: string;
	dateCreated: Date | null;
	twitchLink: string;
	youtubeLink: string;
	twitterLink: string;
};

type SortConfig = { column: keyof User; direction: "asc" | "desc" };

const columns = [
	{ key: "username", label: "Username" },
	{ key: "dateCreated", label: "Account Created" }
];

export default function UserList(): NextPage {
	const [users, setUsers] = useState<Set<User>>(new Set());
	const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [mounted, setMounted] = useState(false);

	const router = useRouter();
	
	const fetchUsers = useCallback(
		async (requestedPage: number, sort: SortConfig | null): Promise<User[]> => {
			const res = await USERS_API_CLIENT.getUsers(
				undefined, // authorization
				undefined, // name
				undefined, // following
				undefined, // banned
				requestedPage, // page number
				50, // limit
			);

			let newData: User[] = (res.data ?? []).map((u: any) => ({
				id: Number(u.id),
				name: u.name,
				dateCreated: u.dateCreated ? new Date(u.dateCreated) : null,
				twitchLink: u.twitchLink,
				youtubeLink: u.youtubeLink,
				twitterLink: u.twitterLink
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
				setUsers(new Set(firstPage));
				setPage(0);
				setHasMore(firstPage.length > 0);
			}
		};

		fetchAndSet();

		return () => {
			isCancelled = true; // cleanup useEffect
		};
	}, [sortConfig, router.isReady]);

	const loadMore = async () => {
		const nextPage = page + 1;
		const moreUsers = await fetchUsers(nextPage, sortConfig);

		if (moreUsers.length === 0) {
			setHasMore(false);
			return;
		}
		
		setUsers((prev) => new Set([...prev, ...moreUsers]));
		setPage(nextPage);
	};

	const loaderRef = useInfiniteScroll<HTMLDivElement>(() => {
		if (hasMore) loadMore();
	});

	const handleSort = (column: keyof User) => {
		if (sortConfig?.column === column) {
			setSortConfig({
				column,
				direction: sortConfig.direction === "asc" ? "desc" : "asc",
			});
		} else {
			setSortConfig({ column, direction: "asc" });
		}
		setPage(0);
	};

	const getSortIcon = (column: keyof User) => {
		if (sortConfig?.column !== column) return "/images/bg.gif";
		return sortConfig.direction === "asc"
			? "/images/asc.gif"
			: "/images/desc.gif";
	};
		
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content" className="px-4 sm:px-6 lg:px-8 min-h-screen scrollbar-gutter-stable">
					<h2>User List</h2>
					<table className="tablesorter min-w-[600px] w-full">
						<thead>
							<tr>
								{columns.map(({ key, label }) => (
									<th
										key={key}
										className={`cursor-pointer ${
											sortConfig?.column === key ? "bg-[#8DBDD8]" : "bg-[#E6EEEE]"
										} bg-right bg-no-repeat p-[4px] border border-solid border-white`}
										style={{
											backgroundImage: `url(${getSortIcon(key as keyof User)})`,
										}}
										onClick={() => handleSort(key as keyof User)}
									>
										{label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{[...users].map((user) => (
							<tr key={user.id}>
								<td className="!max-w-[15em] break-words">
									<Link href="/user/[id]" as={`/user/${user.id}`}>
										{user.name}
									</Link>
								</td>
								<td>
									{user.dateCreated
										? formatDate(user.dateCreated)
										: "Unknown"}
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
				{/* Infinite scroll loader trigger */}
				<div ref={loaderRef} className="h-40" />
			</div>
		</div>
	);
}