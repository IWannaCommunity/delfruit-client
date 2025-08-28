import React, { useEffect } from "react";
import { AnyElem } from "@/utils/element";
import { useRouter } from "next/router";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Head from "next/head";

export default function LostAndFound(): AnyElem {
	const router = useRouter();
	const pathname = router.pathname;
	const desiredPath = router.asPath;

	useEffect(() => {
		router.push(`${desiredPath}`);
	}, [router, pathname, desiredPath]);

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
