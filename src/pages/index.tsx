import Head from "next/head";
import type { AnyElem } from "../utils/element";
import Header from "../components/header";
import News from "../components/home/news";
import Games from "../components/home/games";
import Reviews from "../components/home/reviews";

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
						<Games />
						<Reviews />
					</div>
				</div>
			</body>
		</div>
	);
}
