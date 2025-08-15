import Head from "next/head";
import type { AnyElem } from "../utils/element";
import Header from "../components/header";
import News from "../components/home/news";
import GameList from "../components/home/gameList";
import ReviewList from "../components/home/reviewList";

export default function Home(): JSX.Element {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<body>
				<div id="container">
					<Header />
					<div id="content">
						<News />
						<GameList />
						<ReviewList />
					</div>
				</div>
			</body>
		</div>
	);
}