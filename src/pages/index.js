import Head from 'next/head'
import Header from "../components/Header";
import HomeNews from "../components/Home/HomeNews";
import HotPicks from "../components/Home/HotPicks";
import HomeGames from "../components/Home/HomeGames";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
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
  )
}