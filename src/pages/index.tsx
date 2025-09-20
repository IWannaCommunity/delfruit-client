import Head from "next/head";
import Header from "@/components/header";
import HomeNews from "@/components/home/homeNews";
import GameList from "@/components/home/gameList";
import ReviewList from "@/components/home/reviewList";
import Footer from "@/components/footer";
import Link from "next/link";
import { AnyElem } from "@/utils/element";
import { useEffect, useState } from "react";
import { API } from "@/utils/api";

export default function Home(): AnyElem {

	const [count, setCount] = useState<number>(0);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const resp = await API.reviews().getReviewCount();
				setCount(resp.data.count);
				setError(false);
			} catch (err: any) {
				setError(true);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<HomeNews />
					<GameList />
					<div>
						<h2>Latest Reviews</h2>
						{!error && !loading && <p className="notes">Showing 5 of {count}</p>}
						<ReviewList page={0} limit={5} />
					</div>
					<Link className="standalone" href="/reviews/0">
						Read more reviews!
					</Link>
				</div>
				<Footer />
			</div>
		</div>
	);
}
