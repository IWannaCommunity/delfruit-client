import Head from "next/head";
import Header from "@/components/header";
import News from "@/components/home/news";
import GameList from "@/components/home/gameList";
import ReviewList from "@/components/home/reviewList";
import Footer from "@/components/footer";
import Link from "next/link";
import { AnyElem } from "@/utils/element";

export default function Home(): AnyElem {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<News />
					<GameList />
					<div>
						<h2>Latest Reviews</h2>
						<p className="notes">Showing 5 of 115447</p>
						<ReviewList page={0} limit={5} />
					</div>
					<Link className="standalone" href="/">
						Read more reviews!
					</Link>
				</div>{" "}
				<Footer />
			</div>
		</div>
	);
}
