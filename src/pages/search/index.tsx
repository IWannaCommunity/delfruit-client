import Head from "next/head";
import Header from "../../components/header";
import Search from "../../components/search";

export default function SearchPage(): NextPage {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<Search />
			</div>
		</div>
	);
}