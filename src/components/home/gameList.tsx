import Game from "../game";

export default function GameList(): JSX.Element {
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
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
					<Game />
				</tbody>
			</table>
			<br/>
			<table>
				<tbody>
					<tr>
						<td className="!text-center">
							<a className="text-base" href="/">Full List</a>
						</td>
						<td className="!text-center">
							<a className="text-base" href="/">Random Game!</a>
						</td>
						<td className="!text-center">
							<a className="text-base" href="/">User List</a>
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
		</div>
	);
}