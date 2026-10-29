import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import News from "@/components/news";
import { API } from "@/utils/api";
import { News as NewsT } from "delfruit-swagger-cg-sdk";
import { useEffect, useState, useCallback } from "react";
import { formatDate } from "@/utils/formatDate";
import { useInfiniteScroll } from "@/utils/infiniteScroll";
import { dedupeArray } from "@/utils/dedupeArray";

export default function NewsListPage(): AnyElem {

	const [news, setNews] = useState<NewsT[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [initialized, setInitialized] = useState(false);

	const fetchNews = useCallback(
    async (requestedPage: number): Promise<NewsT[]> => {
			setLoading(true);
			setError(null);

			try {
				const resp = await API.news().getAllNews(
					requestedPage,
					5 // limit
				);

				const newsData: NewsT[] = await Promise.all(
					(resp.data ?? []).map(async (n: any) => {
						let posterName = "User";

					try {
						const user = await API.users().getUser(Number(n.posterId));
						posterName = user.data.name ?? "User";
					} catch {
						setError("Failed to retrieve user.");
					}

					return {
						id: Number(n.id),
						posterId: Number(n.posterId),
						posterName,
						title: n.title,
						news: n.news,
						dateCreated: formatDate(new Date(n.dateCreated)),
						removed: n.removed
					};
				})
			);

			return newsData;
		} catch (err) {
			setError("Failed to load news.");
			return [];
		} finally {
			setLoading(false);
		}
	},[]);

	useEffect(() => {
		setInitialized(false);

		const fetchAndSet = async () => {
			const firstPage = await fetchNews(0);
			setNews(firstPage);
			setPage(0);
			setHasMore(firstPage.length === 5);
			setInitialized(true);
		};

		fetchAndSet();
	}, [fetchNews]);

	const loadMore = useCallback(async () => {
		const nextPage = page + 1;
		const moreNews = await fetchNews(nextPage);

		if (moreNews.length === 0) {
			setHasMore(false);
			return;
		}

		setNews((prev) => dedupeArray([...prev, ...moreNews], (r) => r.id));
		setPage(nextPage);
		setInitialized(true);
	}, [setNews, page, fetchNews]);

	const loaderRef = useInfiniteScroll<HTMLDivElement>(
		() => { if (hasMore) loadMore(); },
		{ enabled: initialized }
	);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;
		if (!news) return null;

		return (
			<>
				{news.map((n) => {
					return (
						<News
							key={n.id}
							id={n.id}
							posterId={n.posterId}
							posterName={n.posterName}
							title={n.title}
							news={n.news}
							dateCreated={n.dateCreated}
							removed={n.removed}
						/>
					);
				})}
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>News - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>News Page</h2>
					<div id="newsContainer">
						{renderContent()}
					</div>
					{/* Infinite scroll trigger */}
					{loaderRef && hasMore ? (
						<div ref={loaderRef} className="h-10" />
					) : (
						<span>No more news.</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}