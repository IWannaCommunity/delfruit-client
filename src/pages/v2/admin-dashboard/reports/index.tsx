import Head from "next/head";
import { useRouter } from "next/router";
import { Report, ReportsApi } from "../../../generated/swagger-codegen";
import { FormEvent, useEffect, useState } from "react";

function ReportEntry(props: { details: Report }): JSX.Element {
	return <>{props.details.id}</>;
}

export default function AdminDashboardReports(): JSX.Element {
	const router = useRouter();

	const [games, setGames] = useState([]);

	const client = new ReportsApi(void 0, "http://localhost:4201");
	useEffect(() => {
		const fetchGames = async () => {
			const req = await client.getReports(
				void 0,
				10,
				void 0,
				void 0,
				void 0,
				void 0,
				false,
			);
			let elems: Array<JSX.Element> = new Array(req.data.length);
			for (const report of req.data) {
				elems.push(<ReportEntry details={report} />);
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
