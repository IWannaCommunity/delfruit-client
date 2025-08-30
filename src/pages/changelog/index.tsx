import { AnyElem } from "@/utils/element";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Head from "next/head";
import News from "@/../NEWS.md";
import { marked } from "marked";
// import * as DOMPurify from "isomorphic-dompurify";

export default function Changelog(): AnyElem {
	const news = marked.parse(News);
	// DANGER: this is where I would sanitize the HTML (if Webpack didn't suck complete ass)
	// DOMPurify.sanitize(news);

	return (
		<>
			<Head>
				<title>Logout - Delicious Fruit</title>
			</Head>
			<body>
				<div id="container">
					<Header />
					<div id="content">
						<div
							dangerouslySetInnerHTML={{
								__html: news,
							}}
						/>
					</div>
					<Footer />
				</div>
			</body>
		</>
	);
}
