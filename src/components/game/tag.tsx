import { AnyElem } from "@/utils/element";
import Whitespace from "../whitespace";
import Link from "next/link";

type TagProps = {
	name: string;
	count: number;
	impossible?: boolean;
};

export default function Tag(props: TagProps): AnyElem {
	return (
		<>
			<Link href="/" className={`tag ${props.impossible ? "impossible-tag" : ""}`}>
				{props.name} ({props.count})
			</Link>
			<Whitespace />
		</>
	);
}
