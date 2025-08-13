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
	Review,
} from "../../generated/swagger-codegen";
import { useEffect, useState, useMemo } from "react";
import { AxiosResponse } from "axios";
import { useSessionContext } from "../../utils/session";
import { ScreenshotsApi, Screenshot } from "../../generated/swagger-codegen";

const apiClient: GamesApi = new GamesApi(void 0, "http://localhost:4201");

const baseScrnshotUrl = "http://192.168.0.13:9000/df2images";

interface GameDetails {
	g: Game;
	r: {
		entries: ReadonlyArray<Rating>;
		absolute: { rating: number; difficulty: number };
	};
	t: ReadonlyArray<{ name: string; id: number }>;
	s: ReadonlyArray<string[]>;
}

export default function GamePage() {
	const [session, setSession] = useSessionContext();
	const [hydrated, setHydrated] = useState<Boolean>(false);

	const router = useRouter();
	const params = router.query;

	const [details, setDetails] = useState<GameDetails>({
		g: {
			name: "",
			dateCreated: "",
			authorRaw: "",
		},
		r: {
			entries: [],
			absolute: {
				rating: -1,
				difficulty: -1,
			},
		},
		t: [],
		s: [],
	});

	useEffect(() => {
		if (router.query && router.query.id) {
			setHydrated(true);
		}
	});

	useMemo(() => {
		if (!hydrated) {
			return;
		}

		(async () => {
			const gameId: string = params["id"];

			// game specific infomation
			const req: AxiosResponse<Game, any> = await apiClient.getGame(gameId);

			// reviews
			const req2: AxiosResponse<Review[], any> = await apiClient.getGameReviews(
				gameId,
				void 0,
				void 0,
				void 0,
				0,
				50,
			);

			// absolute game rating
			const req3: AxiosResponse<Rating, any> = await apiClient.getGameRatings(
				gameId,
			);

			const req4: AxiosResponse<InlineResponse200, any> =
				await apiClient.getGameTags(gameId);

			const apiClient2 = new ScreenshotsApi(void 0, "http://localhost:4201");
			const req5 = await apiClient2.getScreenshots(
				void 0,
				gameId,
				false,
				true,
				0,
				50,
			);
			let scrnshots: string[] = new Array();
			for (const scrnshot of req5.data) {
				scrnshots.push(`${baseScrnshotUrl}/${scrnshot.id}.png`);
			}
			return setDetails({
				g: req.data,
				r: { entries: req2.data, absolute: req3.data },
				t: req4.data,
				s: scrnshots,
			});
		})();
	}, [hydrated, router]);

	if (hydrated) {
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
					rating={details.r.absolute.rating}
					difficulty={details.r.absolute.difficulty}
					tags={details.t}
					dlUrl={details.g.url}
					photos={details.s}
				/>

				<GameReviews reviews={details.r.entries} />

				<Footer />
			</div>
		);
	} else {
		return <></>;
	}
}
