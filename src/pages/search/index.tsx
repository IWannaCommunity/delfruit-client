import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Search from "@/components/search";
import { AnyElem } from "@/utils/element";

export default function SearchPage(): AnyElem {
	return (
		<div>
			<Head>
				<title>Game List - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<Search />
				<Footer />
			</div>
		</div>
	);
}