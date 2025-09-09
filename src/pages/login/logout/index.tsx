import { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Logout(): AnyElem {
	const router = useRouter();
	const [idempotency, setIdempotency] = useState<boolean>(false);
	const [recentlySignedOut, setRecentlySignedOut] = useState<boolean>(false);
	const [session] = useSessionContext();

	// QUEST: perhaps there is a simpler way then using this "idempotency" mechanism.

	useEffect(() => {
		if (session.active) {
			Cookies.remove("session");
			Cookies.set("recentlySignedOut", "1", {
				expires: new Date(Date.now() + 5000),
			});
			router.reload();
		} else {
			const cRecentlySignedOut = Cookies.get("recentlySignedOut");
			if (cRecentlySignedOut !== undefined) {
				setRecentlySignedOut(true);
				Cookies.remove("recentlySignedOut");
			}
			setIdempotency(true);
		}
	}, [session.active, router]);

	return (
		<div>
			<Head>
				<title>Logout - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{idempotency &&
						(recentlySignedOut
							? "You have been logged out."
							: "You are not logged in.")}
				</div>
				<Footer />
			</div>
		</div>
	);
}
