export default function Games(): JSX.Element {
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
					<tr>
						<td>
							<a href="/">I wanna be the Blank</a>
						</td>
						<td className="rating">Aug 13, 2025</td>
						<td className="rating">100</td>
						<td className="rating">10</td>
						<td className="rating">47</td>
					</tr>
					<tr>
						<td>
							<a href="/">I wanna be the Blank 2</a>
						</td>
						<td className="rating">Aug 13, 2025</td>
						<td className="rating">100</td>
						<td className="rating">10</td>
						<td className="rating">47</td>
					</tr>
					<tr>
						<td>
							<a href="/">I wanna be the Blank 3</a>
						</td>
						<td className="rating">Aug 13, 2025</td>
						<td className="rating">100</td>
						<td className="rating">10</td>
						<td className="rating">47</td>
					</tr>
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