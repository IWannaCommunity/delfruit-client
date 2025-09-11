import { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";
import { Message as MessageT } from "delfruit-swagger-cg-sdk";
import Link from "next/link";

type Props = MessageT & {
	userNames: Record<number, string>;
};

export default function MessageThread(props: Props): AnyElem {

	const [session] = useSessionContext();

	return (
		<div className={`review ${(props.user_from_id === session.user_id) ? "owner-review" : ""}`}>
			{/* AUTHOR */}
			<Link href={`/profile/${props.user_from_id}`}>
				{props.userNames[props.user_from_id ?? -1] ?? "Loading..."}
			</Link>
			<br />

			{/* COMMENT */}
			<div className="review-text break-words whitespace-pre-wrap">
				<span>{props.body}</span>
			</div>

			{/* DATE */}
			<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
				{props.date_created}
			</div>
		</div>
	);
}