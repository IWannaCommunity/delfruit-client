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

		const { asPath } = router;
		const url = new URL(asPath, window.location.origin);
		const pathname = url.pathname;
		const params = url.searchParams;

		let destination: string;

		if (pathname === "/ratings/game_details.php") {
			const id = params.get("id");
			destination = id
				? `/game/${encodeURIComponent(id)}`
				: "/";
		} else if (pathname === "/profile.php") {
				const id = params.get("u");
				destination = id
					? `/profile/${encodeURIComponent(id)}`
					: "/";
		} else if (pathname === "/news.php") {
				const id = params.get("id");
				destination = id
					? `/news/${encodeURIComponent(id)}`
					: "/";
		} else {
			destination = asPath;
		}

		if (destination !== asPath) {
			void router.replace(destination);
		}
	}, [router.isReady, router.asPath]);

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
