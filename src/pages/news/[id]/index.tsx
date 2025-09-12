import React from "react";
import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { API } from "@/utils/api";
import { News as NewsT } from "delfruit-swagger-cg-sdk";
import { useMemo, useState } from "react";
import BBCode from "@bbob/react/lib";
import { useRouter } from "next/router";
import presetReact from "@bbob/preset-react/lib";

export default function NewsPage2(): AnyElem {
	const router = useRouter();
	const id = Number(router.query.id);

	const [hydrated, setHydrated] = useState<boolean>(false);
	const [news, setNews] = useState<NewsT>(null);

	const bbobPlugins = [presetReact()];

	useMemo(() => {
		if (!hydrated && router.isReady) {
			setHydrated(true);
		} else {
			return;
		}

		(async () => {
			const resp = await API.news().getNews(id);
			setNews(resp.data);
		})();
	}, [hydrated, router.isReady, id]);

	if (!hydrated || news === null) {
		return <></>;
	}

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>{news.title}</h2>
					<div id="newsContainer">
						<BBCode plugins={bbobPlugins}>{news.news}</BBCode>
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}

