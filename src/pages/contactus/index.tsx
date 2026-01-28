import Head from "next/head";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";

export default function ContactUs(): AnyElem {
	return (
		<>
			<Head>
				<title>Contact Us - Delicious Fruit</title>
			</Head>
			<body>
				<div id="container">
					<Header />
					<div id="content">
						You can contact us by sending a email to
						webmaster@delicious-fruit.com, or by contacting one of the relevant
						webmasters on our Discord!
					</div>
					<Footer />
				</div>
			</body>
		</>
	);
}
