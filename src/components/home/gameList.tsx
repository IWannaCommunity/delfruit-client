import Game, { GameProps } from "../game";

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
                            <a className="text-base" href="/">
                                Full List
                            </a>
                        </td>
                        <td className="!text-center">
                            <a className="text-base" href="/">
                                Random Game!
                            </a>
                        </td>
                        <td className="!text-center">
                            <a className="text-base" href="/">
                                User List
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </div>
    );
}

