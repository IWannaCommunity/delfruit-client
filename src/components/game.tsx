import { AnyElem } from "@/utils/element";
import Link from "next/link";
import { ComponentProps } from "react";

export type GameProps = {
	name: string;
	id: number;
	date_created: Date | null;
	rating: number | null;
	difficulty: number | null;
	rating_count: number;
} & ComponentProps<"div">;

export default function Game(props: GameProps): AnyElem {
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
			<td className="rating">{props.date_created.toString()}</td>
			<td className="rating">
				{props.difficulty === null ? "N/A" : `${props.difficulty}`}
			</td>
			<td className="rating">
				{props.rating === null ? "N/A" : `${props.rating}`}
			</td>
			<td className="rating">{props.rating_count}</td>
		</tr>
	);
}
