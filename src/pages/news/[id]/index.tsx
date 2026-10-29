import React from "react";
import { AnyElem } from "@/utils/element";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import News from "@/components/news";
import { API } from "@/utils/api";
import { News as NewsT } from "delfruit-swagger-cg-sdk";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@/utils/hooks";
import { formatDate } from "@/utils/formatDate";

type NewsWithPoster = NewsT & {
    posterName: string;
};

export default function NewsPage(): AnyElem {
	const [news, setNews] = useState<NewsWithPoster | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [session] = useSessionContext();

	const router = useRouter();

	const handleDelete = async () => {
		if (!news || !session?.admin) return;

		const confirmed = window.confirm(
			"Are you sure you want to delete this news entry?"
		);

		if (!confirmed) return;

		try {
			await API.news().deleteNews(news.id);
			router.replace("/news");
		} catch (err) {
			setError("Failed to delete news entry.");
		}
	};

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		// Anti-trolling measures
		if (isNaN(id) || id < 0 || !id) {
			setError("Invalid page");
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await API.news().getNews(id);
				const news = resp.data;

				if (!news) {
					setError("Invalid page");
					return;
				}

			const posterId = Number(news.posterId);

			let posterName = "User";

			try {
				const user = await API.users().getUser(posterId);
				posterName = user.data.name ?? "User";
			} catch {
				setError("Failed to fetch user.");
			}

			const newsProps: NewsWithPoster = {
				id: Number(news.id),
				posterId,
				posterName,
				title: news.title,
				news: news.news,
				dateCreated: formatDate(new Date(news.dateCreated)),
				removed: news.removed,
			};
			
			setNews(newsProps);

			} catch (err: any) {
				if (err.response?.status === 404) {
					setError("Invalid page");
				} else {
					setError("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [router, router.isReady, router.query.id]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;

		return (
			<>
				<div className="flex items-center justify-between">
					<h2>News Entry</h2>
					{session?.admin && (
						<button
							type="button"
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded"
						>
							Delete
						</button>
					)}
				</div>
				<p>
					<Link href="/news">
						Return to news page
					</Link>
				</p>
				<div id="newsContainer">
					<News
						key={news.id}
						id={news.id}
						posterId={news.posterId}
						posterName={news.posterName}
						title={news.title}
						news={news.news}
						dateCreated={news.dateCreated}
						removed={news.removed}
					/>
				</div>
				<p>
					<Link href="/news">
						Return to news page
					</Link>
				</p>
			</>
		)
	}

	return (
		<div>
			<Head>
				<title>News - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{renderContent()}
				</div>
				<Footer />
			</div>
		</div>
	);
}

