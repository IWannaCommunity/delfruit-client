import { AnyElem } from "@/utils/element";
import ReviewList from "@/components/home/reviewList";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@/components/footer";
import Head from "next/head";
import Header from "@/components/header";

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
			
		}
	}, [router, router.isReady, router.query.id]);

	const goToPage = (newPage: number) => {
		if (newPage >= 0) {
			router.push({ 
				pathname: "/reviews/[id]", 
				query: { id: newPage } 
			});
			setPage(newPage);
		}
	};

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Latest Reviews</h2>
					<div>
						<button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 0}>
							Previous Page
						</button>
						<button type="button" onClick={() => goToPage(page + 1)}>
							Next Page
						</button>		
					</div>
					<ReviewList page={page} limit={25} />
				</div>
				<Footer />
			</div>
		</div>
	);
}