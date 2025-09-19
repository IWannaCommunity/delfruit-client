import { AnyElem } from "@/utils/element";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReviewList from "@/components/home/reviewList";
import Pagination from "@/components/pagination";


export default function Reviews(): AnyElem {
	const [page, setPage] = useState<number>(0);
	const router = useRouter();

	useEffect(() => {
		if (router.isReady) {
			const id = Number(router.query.id);

			// Anti-trolling measures
			if (isNaN(id) || id < 0) {
				router.replace({ pathname: "/reviews/[id]", query: { id: 0 } });
				return;
			}

			setPage(id);
		}
	}, [router, router.isReady, router.query.id]);

	const totalPages = 10818; // HARD-CODED FOR NOW, RETRIEVE FROM API

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Latest Reviews</h2>
					<Pagination page={page} totalPages={totalPages} basePath="/reviews/[id]"/>
					<ReviewList page={page} limit={25} />
					<Pagination page={page} totalPages={totalPages} basePath="/reviews/[id]"/>
				</div>
				<Footer />
			</div>
		</div>
	);
}