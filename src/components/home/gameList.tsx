import Game, { GameProps } from "@/components/game";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

export default function GameList(): JSX.Element {
	
	const [games, setGames] = useState<GameProps[]>([]);
	
	useEffect(() => {
		
		(async () => {
			const resp = await GAMES_API_CLIENT.getGames(
				undefined, // authorization
				undefined, // q
				undefined, // id
				false, // removed
				undefined, // name
				undefined, // nameStartsWith
				undefined, // nameExp
				undefined, // tags
				undefined, // author
				undefined, // ownerUserId
				undefined, // hasDownload
				undefined, // createdFrom
				new Date(Date.now()), // createdTo
				undefined, // clearedByUserId
				undefined, // reviewedByUserId
				undefined, // ratingFrom
				undefined, // ratingTo
				undefined, // difficultyFrom
				undefined, // difficultyTo
				0, // page number
				25, // limit
				"date_created", // orderCol
				"desc" // orderDir
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
					{games?.map((game) => {
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
							<Link className="text-base" href="/search?l=ALL">
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

