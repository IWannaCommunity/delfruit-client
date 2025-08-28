import { AnyElem } from "@/utils/element";
import ReviewList from "@/components/home/reviewList";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@components/footer";
import Head from "next/head";
import Header from "@components/header";

export default function Reviews(): AnyElem {
	const [hydrated, setHydrated] = useState<Boolean>(false);
	const [page, setPage] = useState<Number>(0);
	const router = useRouter();
	// HACK: hopefully usePathname in future versions of Next.js allows me to get around this hack
	const pathname = router.pathname.replace("[id]", "");

	useEffect(() => {
		if (router.isReady && hydrated === false) {
			setHydrated(true);
			// DANGER: THIS WILL FAIL HORRIBLY IF IT'S NOT A PARSABLE NUMBER
			setPage(+router.query.id);
		}
	}, [hydrated, router.isReady, router.query.id]);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Latest Reviews</h2>
					<div>
						<input
							type="button"
							value="Previous Page"
							onClick={(evt) => {
								evt.preventDefault();
								// HACK: this doesn't always cause the page to navigate or refresh, so I rely on useState to perform similar behavior
								router.push(`${pathname}/${page + 1}`);
								setPage(page + 1);
							}}
						/>
						{"              "}
						<input
							type="button"
							value="Next Page"
							onClick={(evt) => {
								evt.preventDefault();
								// HACK: this doesn't always cause the page to navigate or refresh, so I rely on useState to perform similar behavior
								router.push(`${pathname}/${page + 1}`);
								setPage(page + 1);
							}}
						/>
					</div>
					<ReviewList page={page} limit={25} />
				</div>
				<Footer />
			</div>
		</div>
	);
}
