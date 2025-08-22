import Link from "next/link";
import { formatDate } from "../utils/formatDate";

export type GameProps = {
	name: string;
	id: number;
	date_created: Date | null;
	rating: number;
	difficulty: number;
	rating_count: number;
};

export default function Game(props: GameProps): JSX.Element {
	return (
		<tr>
			<td>
				<Link className="!max-w-[12em] !break-all" href={`/game/${props.id}`}>
					{props.name}
				</Link>
			</td>
			<td className="rating">{formatDate(new Date(props.date_created))}</td>
			<td className="rating">{props.rating !== null ? props.rating.toFixed(1) : "N/A"}</td>
			<td className="rating">
				{props.difficulty !== null ? props.difficulty.toFixed(1) : "N/A"}
			</td>
			<td className="rating">{props.rating_count}</td>
		</tr>
	);
}
