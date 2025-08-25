import Link from "next/link";

export type GameProps = {
	name: string;
	id: number;
	date_created: Date | null;
	rating: number | string;
	difficulty: number | string;
	rating_count: number;
};

export default function Game(props: GameProps): JSX.Element {
	
	return (
		<tr>
			<td>
				<Link
					className="!max-w-[12em] !break-all"
					href="/game/[id]"
					as={`/game/${props.id}`}
				>
					{props.name}
				</Link>
			</td>
			<td className="rating">{props.date_created}</td>
			<td className="rating">{props.difficulty}</td>
			<td className="rating">{props.rating}</td>
			<td className="rating">{props.rating_count}</td>
		</tr>
	);
}
