import Game, { GameProps } from "../game";
import Link from "next/link";

type GameListProps = {
    games: GameProps[];
};

export default function GameList(props: GameListProps): JSX.Element {
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
                    {props?.games?.map((game, idx) => {
                        return (
                            <Game
                                key={game.id}
                                name={game.name}
                                id={game.id}
                                date={game.date}
                                rating={game.rating}
                                difficulty={game.difficulty}
                                numOfRatings={game.numOfRatings}
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
                            <Link className="text-base" href="/">
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

