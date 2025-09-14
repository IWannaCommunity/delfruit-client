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
import { formatDate } from "@/utils/formatDate";

export default function NewsPage(): AnyElem {
	const [news, setNews] = useState<NewsT>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

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

				const newsProps: NewsT = {
					id: Number(news.id),
					poster_id: Number(news.poster_id),
					title: news.title,
					news: news.news,
					date_created: formatDate(new Date(news.date_created)),
					removed: news.removed
				}

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
				<h2>News Entry</h2>
				<p>
					<Link href="/news">
						Return to news page
					</Link>
				</p>
				<div id="newsContainer">
					<News
						key={news.id}
						id={news.id}
						poster_id={news.poster_id}
						title={news.title}
						news={news.news}
						date_created={news.date_created}
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
				<title>Delicious Fruit</title>
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

