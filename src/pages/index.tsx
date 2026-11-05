import Head from "next/head";
import Header from "@/components/header";
import HomeNews from "@/components/home/homeNews";
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
					<HomeNews />
					<GameList />
					<ReviewList page={0} limit={5} />
					<Link className="standalone" href="/reviews/0">
						Read more reviews!
					</Link>
				</div>
				<Footer />
			</div>
		</div>
	);
}