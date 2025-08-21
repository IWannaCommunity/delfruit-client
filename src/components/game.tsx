import Link from "next/link";
import { formatDate } from "../utils/formatDate";

export type GameProps = {
	name: string;
	id: number;
	date: Date | string;
	rating: number;
	difficulty: number;
	numOfRatings: number;
};

export default function Game(props: GameProps): JSX.Element {
	return (
		<tr>
			<td>
				<Link className="!max-w-[12em] !break-all" href={`/game/${props.id}`}>
					{props.name}
				</Link>
			</td>
			<td className="rating">{formatDate(props.date)}</td>
			<td className="rating">{props.rating !== -1 ? props.rating : "N/A"}</td>
			<td className="rating">
				{props.difficulty !== -1 ? props.difficulty : "N/A"}
			</td>
			<td className="rating">{props.numOfRatings}</td>
		</tr>
	);
}
