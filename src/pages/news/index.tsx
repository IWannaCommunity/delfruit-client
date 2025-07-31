import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function NewsIndex(): JSX.Element {
	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />
			<Footer />
		</div>
	);
}
