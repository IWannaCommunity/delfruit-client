import { AnyElem } from "@/utils/element";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/router";

export default function ReportSubmit(): AnyElem {

	const router = useRouter();
	const { id } = router.query;

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{id && router.isReady ? (
						<>
							<p>
								Thank you for your report! Your report ID is
								<span className="font-bold ml-1">{id}</span>
								<span>
									, please refer to this ID if you need to discuss
									this report with an administrator.
								</span>
							</p>
							<p>
								<Link href="/">Return to the main page</Link>
							</p>
						</>
					) : (
						<span className="text-red-600">Invalid page</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}