import { useEffect, useState } from "react";
import Game, { type GameProps } from "@/components/game";
import { API } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";

export default function DeletedGameList(): JSX.Element {
  const [session] = useSessionContext();
	const [games, setGames] = useState<GameProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const results = await API.games().getGames(
        undefined, // authorization
        undefined, // q
        undefined, // id
        true, // removed
        undefined, // name
        undefined, // nameStartsWith
        undefined, // nameExp
        undefined, // tags
        undefined, // author
        undefined, // ownerUserId
        undefined, // hasDownload
        undefined, // createdFrom
        undefined, // createdTo
        undefined, // clearedByUserId
        undefined, // reviewedByUserId
        undefined, // ratingFrom
        undefined, // ratingTo
        undefined, // difficultyFrom
        undefined, // difficultyTo
        undefined, // page
        undefined, // limit
        "date_created",
        "desc",
      )

			// Games result
			try {
				const gameProps: GameProps[] = results.data.map((game) => ({
					name: game.name,
					id: game.id,
					date_created: game.date_created
						? formatDate(new Date(game.date_created))
						: null,
					rating:
						game.rating === null ? null : Number(game.rating / 10).toFixed(1),
					difficulty:
						game.difficulty === null
							? null
							: Number(game.difficulty).toFixed(1),
					rating_count: game.rating_count,
				}));
				setGames(gameProps);
				setLoading(false);
			} catch {
				setError("Failed to load games.");
			}
		};

		fetchData();
	}, []);

	const renderContent = () => {

    if (!session.active || !session.admin) {
      return <span>You do not have access to this page</span>;
		}
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;

		return (
			<>
				<h2>Deleted Fangames</h2>
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
			</>
		);
	};

	return (
		<div className="!mb-[1em]">
			{renderContent()}
		</div>
	);
}