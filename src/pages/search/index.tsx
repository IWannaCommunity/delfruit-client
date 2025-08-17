import Head from "next/head";
import type { AnyElem } from "../utils/element";
import Header from "../../components/header";
import Search from "../../components/search";

export default function Game(): JSX.Element {
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