import { useState, useEffect } from "react";
import Link from "next/link";
import TabBar from "@/components/helpers/tabBar";
import { MessagesApi, Message as MessageT } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { formatDate } from "@/utils/formatDate";
import { useUserNames } from "@/utils/userNameCache";
import { Config } from "@/utils/config";

const CFG: Config = require("@/config.json");
const MESSAGES_API_CLIENT = new MessagesApi(undefined, CFG.apiURL.toString());

export type MessageTabValue = "inbox" | "outbox";

export default function MessageTable(): JSX.Element {
	const [session] = useSessionContext();
	const [activeTab, setActiveTab] = useState<MessageTabValue>("inbox");
	const [inboxMessages, setInboxMessages] = useState<MessageT[]>([]);
	const [outboxMessages, setOutboxMessages] = useState<MessageT[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const tabs = [
		{ label: "Inbox", value: "inbox" },
		{ label: "Outbox", value: "outbox" },
	] as const;

	useEffect(() => {
		const fetchMessages = async () => {
			setError(null);
			setLoading(true);

			try {
				if (activeTab === "inbox") {
					const res = await MESSAGES_API_CLIENT.getMessagesFromInbox(`Bearer ${session.token}`);
					setInboxMessages(res.data || []);
				} else {
					const res = await MESSAGES_API_CLIENT.getMessagesFromInbox(`Bearer ${session.token}`); // Replace with outbox when ready
					setOutboxMessages(res.data || []);
				}
			} catch (err) {
				setError("Failed to fetch messages.");
			} finally {
				setLoading(false);
			}
		};

		fetchMessages();
	}, [activeTab, session.token]);

	const messages = activeTab === "inbox" ? inboxMessages : outboxMessages;
	const headers = activeTab === "inbox" ? ["From", "Subject", "Date"] : ["To", "Subject", "Date"];

	const userNames = useUserNames(messages, activeTab);

	return (
		<div className="border border-solid border-gray-400 rounded-md bg-white text-[1.1em] font-verdana">
			<div className="border border-gray-400 rounded-md p-[0.25em]">
				
				{/* Tabs */}
				<TabBar<MessageTabValue> tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

				{loading ? (
					<div className="px-[1.5em] py-[1em] text-gray-500">Loading...</div>
				) : (
					<div className="px-[1.5em]">
						{/* Table */}
						<table className="text-center">
							<thead className="bg-gray-300 text-gray-500 font-bold">
								<tr>
									{headers.map((header) => (
										<th key={header} className="py-[0.1em] bg-[#d0d0d0] px-[1em]">
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{error && <span className="text-red-600"> {error}</span>}
								{messages.length === 0 ? (
									<tr>
										<td colSpan={3} className="py-2 text-gray-400 italic">
											No messages
										</td>
									</tr>
								) : (
									messages.map((msg) => (
										<tr key={msg.id}>
											{activeTab === "inbox" ? (
												<td>{userNames[msg.user_from_id ?? -1] ?? "Loading..."}</td>
											) : (
												<td>{userNames[msg.user_to_id ?? -1] ?? "Loading..."}</td>
											)}
											<td>
												<Link href={`/messages/${msg.thread_id}`} className="text-blue-600 hover:underline">
													{msg.subject}
												</Link>
											</td>
											<td>{formatDate(new Date(msg.date_created), true)}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}