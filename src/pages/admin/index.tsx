import Head from "next/head";
import ReportList from "@/components/admin/reportList";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";

export default function AdminIndex(): AnyElem {
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<ReportList
					page={0}
					limit={50}
					searchId={null}
					filters={{ type: "all", answered: false, order: "DESC" }}
				/>
				<Footer />
			</div>
		</div>
	);
}
