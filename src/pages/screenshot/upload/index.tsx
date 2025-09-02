import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";
import UploadScreenshot from "@/components/game/uploadScreenshot";

export default function ScreenshotUploadPage(): AnyElem {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<UploadScreenshot/>
				</div>
				<Footer />
			</div>
		</div>
	);
}