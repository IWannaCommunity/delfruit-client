import Head from "next/head";
import type { AnyElem } from "../utils/element";
import Header from "../components/header";

export default function Home(): JSX.Element {
	return (
		<>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<body>
				<div id="container">
					<Header />
				</div>
			</body>
		</>
	);
}
