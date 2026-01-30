import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ReviewList from "@/components/home/reviewList";
import Pagination from "@/components/helpers/pagination";
import { API } from "@/utils/api";

export default function Reviews(): JSX.Element {
	const [page, setPage] = useState<number>(0);
	const [totalPage, setTotalPage] = useState<number>(0);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	const limit = 20;

	useEffect(() => {
		if (router.isReady) {
			const id = Number(router.query.id);

			// Anti-trolling measures
			if (isNaN(id) || id < 0) {
				router.replace({ pathname: "/reviews/[id]", query: { id: 0 } });
				return;
			}

			setPage(id);

			(async () => {
				try {
					const resp = await API.reviews().getReviewCount();
					const total = Math.ceil(resp.data.count/limit);
					setTotalPage(total);
					setError(false);
				} catch (err: any) {
					setError(true);
				} finally {
					setLoading(false);
				}
			})();
		}
	}, [router, router.isReady, router.query.id]);

	return (
		<div>
			<Head>
				<title>Review List - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Latest Reviews</h2>
					{!loading && !error && (
						<>
							<Pagination page={page} totalPages={totalPage} basePath="/reviews/[id]"/>
							<ReviewList page={page} limit={limit} />
							<Pagination page={page} totalPages={totalPage} basePath="/reviews/[id]"/>
						</>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}