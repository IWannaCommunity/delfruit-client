import Head from "next/head";
import { useRouter } from "next/router";
import { Game, GamesApi } from "../../../generated/swagger-codegen";
import { FormEvent, useEffect, useState } from "react";
import { times } from "lodash";

function EditPanel(props: { data: Game }): JSX.Element {
	async function saveChanges(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const client = new GamesApi(void 0, "http://localhost:4201");

		const formdata = new FormData(evt.currentTarget);

		await client.patchGame(formdata as Game, "", props.data.id);
	}

	return (
		<>
			<form onSubmit={saveChanges}>
				<label>
					Game Name
					<input type="text" name="game" />
				</label>
				<label>
					URL
					<input type="url" name="url" />
				</label>
				<label>
					Author
					<input type="text" name="author_raw" />
				</label>
				<label>
					Collab
					<input type="checkbox" name="collab" />
				</label>
				<button type="submit">
					<label>Save Changes</label>
				</button>
			</form>
		</>
	);
}

function GameEntry(props: { details: Game }): JSX.Element {
	const [showEditPanel, setShowEditPanel] = useState(false);

	return (
		<p key={props.details.id}>
			{props.details.name}
			<div></div>
			<button
				id={`${props.details.id}`}
				type="button"
				onClick={async (
					evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
				) => {
					evt.preventDefault();
					setShowEditPanel(!showEditPanel);
				}}
			>
				update 🛠
			</button>
			<div>{showEditPanel && <EditPanel data={props.details} />}</div>
			<div>&nbsp;</div>
		</p>
	);
}

export default function AdminDashboardGames(): JSX.Element {
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
				elems.push(<GameEntry details={game} />);
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
