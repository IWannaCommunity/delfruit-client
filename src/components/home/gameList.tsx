import Game, { GameProps } from "@/components/game";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

type GameListProps = {
    games: GameProps[];
};

export default function GameList(): JSX.Element {
	
	const [games, setGames] = useState<GameProps[]>([]);
	
	useEffect(() => {
		
		(async () => {
			const resp = await GAMES_API_CLIENT.getGames(
				undefined,
				undefined,
				false,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				new Date(Date.now()), // createdTo
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				0,
				25,
				"date_created",
				"desc",
			);

			const gameProps: GameProps[] = resp.data.map((game) => ({
				name: game.name,
				id: game.id,
				date_created: game.date_created ? formatDate(new Date(game.date_created)) : null,
				rating: game.rating === null ? null : Number(game.rating / 10).toFixed(1),
				difficulty: game.difficulty === null ? null : Number(game.difficulty).toFixed(1),
				rating_count: game.rating_count,
			}));

			setGames(gameProps);
		})();
	}, []);
	
	return (
		<div className="!mb-[1em]">
			<h2>Newest Fangames</h2>
			<p className="notes">Showing 25 of 14370</p>
			<table className="gamelist">
				<tbody>
					<tr>
						<th className="!px-[12em]">Game</th>
						<th>Release Date</th>
						<th>Difficulty</th>
						<th>Rating</th>
						<th># of Ratings</th>
					</tr>
					{games?.map((game, idx) => {
						return (
							<Game
								key={game.id}
								name={game.name}
								id={game.id}
								date_created={game.date_created}
								rating={game.rating}
								difficulty={game.difficulty}
								rating_count={game.rating_count}
							/>
						);
				})}
			</tbody>
	</table>
	<br />
	<table>
			<tbody>
				<tr>
					<td className="!text-center">
						<Link className="text-base" href="/search?q=ALL">
							Full List
						</Link>
					</td>
					<td className="!text-center">
						<Link className="text-base" href="/">
							Random Game!
						</Link>
					</td>
					<td className="!text-center">
						<Link className="text-base" href="/userlist">
							User List
						</Link>
					</td>
				</tr>
				</tbody>
			</table>
			<br />
		</div>
	);
}

