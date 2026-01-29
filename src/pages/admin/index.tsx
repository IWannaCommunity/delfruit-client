import Head from "next/head";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@/utils/hooks";

export default function AdminIndex(): AnyElem {
	const router = useRouter();
	const [session] = useSessionContext();

	useEffect(() => {

		if (session.admin) {
			router.replace("/admin/0");
		}
	}, [session, router]);

	if (!session.active || !session.admin) {
		return (
			<div>
				<Head>
					<title>Delicious Fruit</title>
				</Head>
				<div id="container">
					<Header />
					<div id="content">
						<span>You do not have access to this page</span>
					</div>
					<Footer />
				</div>
			</div>
		);
	}

	return null;
}