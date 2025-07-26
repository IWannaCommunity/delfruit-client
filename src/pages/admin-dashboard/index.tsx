import Head from "next/head";
import { useRouter } from "next/router";
import { GamesApi } from "../../generated/swagger-codegen";
import { useEffect, useState } from "react";

function AdminDashboard(): JSX.Element {
	const router = useRouter();

	const [currentTab, setTab] = useState("games");
	const [games, setGames] = useState([]);

	const client = new GamesApi();

	return (
		<div className="bg-[#F9F9F9]">
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
		</div>
	);
}

export default AdminDashboard;
