import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";
import MessageTable from "@/components/messages/messageTable";
import type { AnyElem } from "@/utils/element";
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
							<h3>
								NOTE: Messages older than June 1st will not show up here, as
								messages now have a new incompatible format. We are working on a
								way to display messages from the old format.
							</h3>
							<Link className="standalone" href="/messages/compose">
								Send a message...
							</Link>
							<MessageTable />
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

