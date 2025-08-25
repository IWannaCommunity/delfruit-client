import { AnyElem } from "@/utils/element";
import Link from "next/link";

type TagProps = {
	name: string;
	count?: number | null;
};

export default function Tag(props: TagProps): AnyElem {
	return (
		<>
			<Link href="/" className={`tag mr-[0.35em] ${props.name === "Impossible" ? "impossible-tag" : ""}`}>
				{props.name} {props.count ? `(${props.count})` : ""}
			</Link>
		</>
	);
}
