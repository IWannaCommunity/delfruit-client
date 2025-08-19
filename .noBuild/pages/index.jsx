import Head from "next/head";
import Header from "../components/header";
import HomeNews from "../components/home/news";
import HotPicks from "../components/home/hotpicks";
import HomeGames from "../components/home/games";
import Footer from "../components/footer";

export default function Home() {
	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<HomeNews />

			<HotPicks />

			<HomeGames />

			<Footer />
		</div>
	);
}
