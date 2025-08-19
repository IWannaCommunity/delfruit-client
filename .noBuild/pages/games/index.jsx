import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import GameBanner from "../../components/games/banner";
import GameDetails from "../../components/games/details";
import GameReviews from "../../components/games/reviews";
import { useRouter } from "next/router";

const GamePage = () => {
	const router = useRouter();

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://cdn.jsdelivr.net" />
			</Head>

			<Header />

			<GameBanner />

			<GameDetails
				title="I Wanna Be The Guy"
				date="06/12/2022"
				creator="Kayin"
				rating="76"
				difficulty="42"
			/>

			<GameReviews count="6" />

			<Footer />
		</div>
	);
};

export default GamePage;

