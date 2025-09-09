import { AnyElem } from "@/utils/element";
import Link from "next/link";

type TagProps = {
	id: number;
	name: string;
	count: number | null;
};

export default function Tag(props: TagProps): AnyElem {
	return (
		<>
			<Link href={`/search/?tags=${props.name}`} className={`tag mr-[0.35em] ${props.name === "Impossible" ? "impossible-tag" : ""}`}>
				{props.name} {props.count ? `(${props.count})` : ""}
			</Link>
		</>
	);
}
