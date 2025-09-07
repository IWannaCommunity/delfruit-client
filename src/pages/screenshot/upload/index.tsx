import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ScreenshotUploadPage(): AnyElem {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<span className="text-red-600">Invalid Page</span>
				</div>
				<Footer />
			</div>
		</div>
	);
}