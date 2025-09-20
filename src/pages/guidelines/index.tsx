import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SuspensionRules from "@/components/guidelines/suspensionRules";
import ReviewRules from "@/components/guidelines/reviewRules";
import SubmittingRules from "@/components/guidelines/submittingRules";
import ScreenshotRules from "@/components/guidelines/screenshotRules";
import AccountRules from "@/components/guidelines/accountRules";

export default function Guidelines(): AnyElem {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<p>
						Here at delicious-fruit be believe that everyone has the right to give their
						honest opinion on the games we have in our database! There's just a few small
						rules we ask that you follow.
					</p>

					<SuspensionRules/>
					<ReviewRules/>
					<SubmittingRules/>
					<ScreenshotRules/>
					<AccountRules/>

					<h3>Site Administrators</h3>
					{/* TODO: FILL */}
				</div>
				<Footer />
			</div>
		</div>
	);
}