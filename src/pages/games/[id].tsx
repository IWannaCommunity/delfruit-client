import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import GameBanner from "../../components/games/banner";
import GameDetails from "../../components/games/details";
import GameReviews from "../../components/games/reviews";
import { useRouter } from "next/router";
import {
	Game,
	GamesApi,
	InlineResponse200,
	Rating,
} from "../../generated/swagger-codegen";
import { useEffect, useState, useMemo } from "react";
import { AxiosResponse } from "axios";
import { useAsyncEffect } from "../../utils/session";

const apiClient: GamesApi = new GamesApi(void 0, "http://localhost:4201");

export default function GamePage() {
	const router = useRouter();
	const params = router.query;

	const [details, setDetails] = useState<{
		g: Game;
		r: Rating;
		t: ReadonlyArray<{ name: string; id: number }>;
	}>({
		g: {
			name: "",
			dateCreated: "",
			authorRaw: "",
		},
		r: {
			rating: -1,
			difficulty: -1,
		},
		t: [],
	});

	useMemo(() => {
		(async () => {
			const requestedPageId: string = params["id"];
			const req: AxiosResponse<Game, any> = await apiClient.getGame(
				requestedPageId,
			);

			const gameId: string = params["id"];
			const req2: AxiosResponse<Rating, any> = await apiClient.getGameRatings(
				gameId,
			);

			const req3: AxiosResponse<InlineResponse200, any> =
				await apiClient.getGameTags(gameId);
			console.log(req3);
			req3.data;

			return setDetails({ g: req.data, r: req2.data, t: req3.data });
		})();
	}, []);

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<GameBanner />

			<GameDetails
				title={details.g.name}
				date={details.g.dateCreated}
				creator={details.g.authorRaw}
				rating={details.r.rating}
				difficulty={details.r.difficulty}
				tags={details.t}
			/>

			<GameReviews count="6" />

			<Footer />
		</div>
	);
}
