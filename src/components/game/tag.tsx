import { AnyElem } from "../../utils/element";
import Whitespace from "../whitespace";

type TagProps = {
	name: string;
	count: number;
	impossible?: boolean;
};

export default function Tag(props: TagProps): AnyElem {
	return (
		<>
			<a href="/" className={"tag" + props.impossible ? "impossible-tag" : ""}>
				{props.name} ({props.count})
			</a>
			<Whitespace />
		</>
	);
}
