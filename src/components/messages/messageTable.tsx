import { useState, useEffect } from "react";
import Link from "next/link";
import TabBar from "@/components/helpers/tabBar";
import { API } from "@/utils/api";
import { Message as MessageT } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { formatDate } from "@/utils/formatDate";
import { useUserNames } from "@/utils/userNameCache";

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

	function truncate(text: string, maxLength: number): string {
		if (!text) return "";
		return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
	}

	useEffect(() => {
		const fetchMessages = async () => {
			setError(null);
			setLoading(true);

			try {
				if (activeTab === "inbox") {
					const res = await API.messages().getMessagesFromInbox(`Bearer ${session.token}`);
					const messages = res.data || [];

					const latestByThread = Object.values(
					messages.reduce<Record<number, MessageT>>((acc, msg) => {
						const threadId = msg.thread_id ?? msg.id;
						const msgDate = new Date(msg.date_created);
						const accDate = acc[threadId] ? new Date(acc[threadId].date_created) : null;

						if (!acc[threadId] || msgDate > (accDate as Date)) {
							acc[threadId] = msg;
						}
						return acc;
					}, {})
				);

				setInboxMessages(latestByThread);

				} else {
					const res = await API.messages().getMessagesFromInbox(`Bearer ${session.token}`); // Replace with outbox when ready
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
	const headers = activeTab === "inbox" ? ["From", "Subject", "Message", "Date"] : ["To", "Subject", "Message", "Date"];

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
								{messages.length === 0 ? (
									<tr>
										<td colSpan={4} className="py-2 text-gray-400 italic">
											{error ? (
												<span className="text-red-600">{error}</span>
											)
											: (
												<span>No messages</span>
											)}
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
													{truncate(msg.subject, 10)}
												</Link>
											</td>
											<td className="text-gray-600">
												{truncate(msg.body, 10)}
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