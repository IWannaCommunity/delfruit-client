import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Compose from "@/components/messages/compose";
import { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";

export default function ComposePage(): AnyElem {

	const [session] = useSessionContext();

	return (
		<div>
			<Head>
				<title>Send a PM - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{session.active ? (
						<Compose />
					) : (
						<span>Page not available. Please login first.</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}