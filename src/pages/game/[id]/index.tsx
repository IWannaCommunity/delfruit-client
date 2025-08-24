import Head from "next/head";
import Header from "@/components/header";
import GameInfo from "@/components/game/gameInfo";
import Carousel from "@/components/game/carousel";
import GameReviews from "@/components/game/gameReviews";
import { CompositeApi, GameExt } from "delfruit-swagger-cg-sdk";
import { Config } from "@/utils/config";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";

const CFG: Config = require("@/config.json");

const images=[
	{"src": "/images/v2/ShowcasedImage-Test.png", "alt": "test"},
	{"src": "/images/v2/screenshot2.png", "alt": "test"},
	{"src": "/images/v2/screenshot3.png", "alt": "test"},
	{"src": "/images/v2/screenshot4.png", "alt": "test"}
];

const APICLIENT = new CompositeApi(undefined, CFG.apiURL.toString());

export default function Game(): NextPage {
	const [details, setDetails] = useState<GameExt>(null);

	const router = useRouter();
	const params = router.query;

	useMemo(() => {
		if (params.id === null || params.id === undefined) {
			return;
		}
		if (details !== null) {
			return;
		}

		(async () => {
			const resp = await APICLIENT.getGameCompositeAll(params.id);
			setDetails(resp.data);
		})();
	}, [params.id, details]);

	if (details === null) {
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
					<div className="!w-full">
						<GameInfo game={details} />
						<Carousel images={images}/>
					</div>
					<GameReviews reviews={details.reviews} />
				</div>
			</div>
		</div>
	);
}
