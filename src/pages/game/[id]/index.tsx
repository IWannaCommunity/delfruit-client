import Head from "next/head";
import type { AnyElem } from "../../../utils/element";
import Header from "../../../components/header";
import GameInfo from "../../../components/game/gameInfo";
import Carousel from "../../../components/game/carousel";
import GameReviews from "../../../components/game/gameReviews";
import { CompositeApi, GameExt } from "delfruit-swagger-cg-sdk";
import { Config } from "../../../utils/config";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const CFG: Config = require("../../../config.json");

const APICLIENT = new CompositeApi(void 0, CFG.apiURL.toString());

export default function Game(): JSX.Element {
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
			console.log(resp.data);
			setDetails(resp.data);
		})();
	}, [params.id]);

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
					</div>
					<GameReviews reviews={details.reviews} />
				</div>
			</div>
		</div>
	);
}
