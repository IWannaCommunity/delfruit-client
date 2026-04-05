import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";

export default function LostAndFound(): AnyElem {
	const router = useRouter();
	const pathname = router.pathname;
	const desiredPath = router.asPath;

	useEffect(() => {
		if (desiredPath.includes("/ratings/game_details.php?id=")) {
			const gameId = desiredPath.split("/ratings/game_details.php?id=")[1];
			return router.push(`/game/${gameId}`);
		} else if (desiredPath.includes("/profile.php?u=")) {
			const userId = desiredPath.split("/profile.php?u=")[1];
			return router.push(`/profile/${userId}`);
		} else if (desiredPath.includes("/news.php?id=")) {
			const newsId = desiredPath.split("/news.php?id=")[1];
			return router.push(`/news/${newsId}`);
		}
		router.push(`${desiredPath}`);
	}, [router, desiredPath]);

	return (
		<>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h1>Locating the page you want to visit...</h1>
				</div>{" "}
				<Footer />
			</div>
		</>
	);
}
