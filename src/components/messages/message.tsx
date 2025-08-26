import { formatDate } from "../../utils/formatDate";
import Link from "next/link";

export type MessageProps = {
	id: number;
	userFromId: number;
	userToId: number;
	subject: string;
	body: string;
	dateCreated: Date | null;
	replyToId: number;
	threadId: number;
};

export default function Message(props: MessageProps): JSX.Element {
	return(
		<tr>
			<td className="text-center">{props.subject}</td>
			<td className="text-center">
				<Link href="/">{props.body}</Link>
			</td>
			<td className="text-center">{formatDate(new Date(props.date_created))}</td>
		</tr>
	);
}
