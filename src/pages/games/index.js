import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GameBanner from "../../components/Games/GameBanner";
import GameDetails from "../../components/Games/GameDetails";
import GameReviews from "../../components/Games/GameReviews";
import { useRouter } from "next/router";

const GamePage = () => {
	
	const router = useRouter();
	
	return (
		<div>
		
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
	
			<Header />
			
			<GameBanner />
			
			<GameDetails title="I Wanna Be The Guy" date="06/12/2022" creator="Kayin" rating="76" difficulty="42" />
			
			<GameReviews count="6" />
			
			<Footer />
	  
		</div>
	)
}

export default GamePage;