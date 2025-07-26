import Head from "next/head";
import { useRouter } from "next/router";
import { GamesApi } from "../../../generated/swagger-codegen";
import { useEffect, useState } from "react";
import { times } from "lodash";

function AdminDashboard(): JSX.Element {
	const router = useRouter();

	const [games, setGames] = useState([]);

	const client = new GamesApi(void 0, "http://localhost:4201");

	useEffect(() => {
		const fetchGames = async () => {
			const req = await client.getGames(
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				10,
			);
			let elems: Array<JSX.Element> = new Array(req.data.length);
			for (const game of req.data) {
				elems.push(<p key={game.id}>{game.name}</p>);
			}
			setGames(elems);
		};

		fetchGames();
	}, []);

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{games}
		</div>
	);
}

export default AdminDashboard;
