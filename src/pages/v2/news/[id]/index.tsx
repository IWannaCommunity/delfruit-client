import Head from "next/head";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function NewsPage(): JSX.Element {
	const [hydrated, setHydrated] = useState<Boolean>(false);

	const router = useRouter();
	const params = router.query;

	useEffect(() => {
		if (params && params.id) {
			setHydrated(true);
		}
	});

	if (!hydrated) {
		return <></>;
	}

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />
			<Footer />
		</div>
	);
}
