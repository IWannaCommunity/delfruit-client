import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import GameBanner from "../../components/games/banner";
import GameDetails from "../../components/games/details";
import GameReviews from "../../components/games/reviews";
import { useRouter } from "next/router";
import { Game, GamesApi } from "../../generated/swagger-codegen";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

const apiClient: GamesApi = new GamesApi(void 0, "http://localhost:4201");

export default function GamePage() {
	const router = useRouter();
	const params = router.query;

	const [details, setDetails] = useState<Game>({
		name: "",
		dateCreated: "",
		authorRaw: "",
	});

	useEffect(() => {
		(async () => {
			const requestedPageId: string = params["id"];
			const req: AxiosResponse<Game, any> = await apiClient.getGame(
				requestedPageId,
			);
			console.log(req);
			req.data;
			return setDetails(req.data);
		})();
	});

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<GameBanner />

			<GameDetails
				title={details.name}
				date={details.dateCreated}
				creator={details.authorRaw}
				rating="72"
				difficulty="42"
			/>

			<GameReviews count="6" />

			<Footer />
		</div>
	);
}
