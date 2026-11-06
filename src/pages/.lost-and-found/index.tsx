import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";

export default function LostAndFound(): AnyElem {
	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) return;

		const desiredPath = router.asPath;
		const url = new URL(desiredPath, window.location.origin);
		const pathname = url.pathname;
		const params = url.searchParams;

		let destination: string | null = null;

		if (pathname === "/ratings/game_details.php") {
			const gameId = params.get("id");
			if (gameId) destination = `/game/${encodeURIComponent(gameId)}`;
		} else if (pathname === "/profile.php") {
			const userId = params.get("u");
			if (userId) destination = `/profile/${encodeURIComponent(userId)}`;
		} else if (pathname === "/news.php") {
			const newsId = params.get("id");
			if (newsId) destination = `/news/${encodeURIComponent(newsId)}`;
		}

		if (destination) {
			void router.replace(destination);
		} else {
			router.push(desiredPath);
		}
	}, [router.isReady, router.asPath, router]);

	return (
		<>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h1>Locating the page you want to visit...</h1>
				</div>
				<Footer />
			</div>
		</>
	);
}