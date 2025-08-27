import Head from "next/head";
import Header from "@/components/header";
import News from "@/components/home/news";
import GameList from "@/components/home/gameList";
import ReviewList from "@/components/home/reviewList";
import { NextPage } from "next";

export default function Home(): NextPage {
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
					<ReviewList />
				</div>
			</div>
		</div>
	);
}

