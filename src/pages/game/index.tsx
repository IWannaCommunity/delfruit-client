import Head from "next/head";
import type { AnyElem } from "../utils/element";
import Header from "../../components/header";
import GameInfo from "../../components/game/gameInfo";
import Carousel from "../../components/game/carousel";
import GameReviews from "../../components/game/gameReviews";

export default function Game(): JSX.Element {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<div className="!w-full">
						<GameInfo />
					</div>
					<GameReviews />
				</div>
			</div>
		</div>
	);
}