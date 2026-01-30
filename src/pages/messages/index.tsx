import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MessageTable from "@/components/messages/messageTable";
import { AnyElem } from "@/utils/element";
import Link from "next/link";
import { useSessionContext } from "@/utils/hooks";

export default function MessagePage(): AnyElem {

	const [session] = useSessionContext();

	return (
		<div>
			<Head>
				<title>Private Messages - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{session.active ? (
						<>
							<h2>My Private Messages</h2>
							<Link className="standalone" href="/messages/compose">Send a message...</Link>
							<MessageTable/>
						</>
					) : (
						<span>Page not available. Please login first.</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}