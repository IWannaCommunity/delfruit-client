import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MessageThread from "@/components/messages/messageThread";
import { AnyElem } from "@/utils/element";
import { useUserNames } from "@/utils/userNameCache";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { Message as MessageT } from "delfruit-swagger-cg-sdk";
import { useEffect, useState, useCallback, useMemo } from "react";

export default function MessagePage(): AnyElem {

	const [session] = useSessionContext();
	const [messages, setMessages] = useState<MessageT[]>([]);
	const [replyText, setReplyText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	const fetchMessages = useCallback(async (id: number) => {
		const resp = await API.messages().getMessagesFromThread(
			`Bearer ${session.token}`, // authorization
			id, // id
		);
		return resp.data;
	}, [session.token]);

	const handleSend = async () => {
		if (!replyText.trim()) return;
		if (!messages.length) {
			setError("No messages in thread, cannot reply.");
			return;
		}

		const lastMessage = messages[messages.length - 1];

		try {
			// Determine recipient for reply
			let recipientId: number | undefined;
			if (lastMessage.user_from_id === session.user_id) {
				recipientId = lastMessage.user_to_id;
			} else {
				recipientId = lastMessage.user_from_id;
			}

			if (!recipientId) {
				setError("Could not determine recipient for reply.");
				return;
			}

			const newMessage = {
				body: replyText,
				replyToId: lastMessage.id,
				userToId: recipientId,
				subject: lastMessage.subject,
			};

			await API.messages().postMessage(newMessage, `Bearer ${session.token}`);

			// Reset input
			setReplyText("");
			const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
			if (textarea) textarea.style.height = "auto";

			// Refresh thread
			const threadId = lastMessage.thread_id ?? lastMessage.threadId;
			if (threadId) {
				const data = await fetchMessages(threadId);
				const messageProps: MessageT[] = data.map((msg) => ({
					id: msg.id,
					user_from_id: msg.user_from_id,
					user_to_id: msg.user_to_id,
					subject: msg.subject,
					body: msg.body,
					reply_to_id: msg.reply_to_id,
					thread_id: msg.thread_id,
					date_created: msg.date_created
						? formatDate(new Date(msg.date_created), true)
						: null,
				}));
				setMessages(messageProps);
			}
		} catch (err) {
			setError("Failed to send message");
			console.log(err);
		}
	};

	useEffect(() => {

		if (!router.isReady) return;

		const id = Number(router.query.id);

		if (isNaN(id) || id <= 0) {
			setError("Invalid page");
			setLoading(false);
			return;
		}
		
		(async () => {

			setLoading(true);

			try {
				const data = await fetchMessages(id);
				const messageProps: MessageT[] = data.map((msg) => ({
					id: msg.id,
					user_from_id: msg.user_from_id,
					user_to_id: msg.user_to_id,
					subject: msg.subject,
					body: msg.body,
					reply_to_id: msg.reply_to_id,
					thread_id: msg.thread_id,
					date_created: msg.date_created 
						? formatDate(new Date(msg.date_created), true) 
						: null,
				}));

				setMessages(messageProps);
				setError(null);
			} catch (err: any) {
				setError("Failed to load messages.");
			} finally {
				setLoading(false);
			}
		})();
	}, [fetchMessages, router.isReady]);

	const allUserIds = useMemo(() => {
		return [
			...new Set(messages.flatMap((m) => [m.user_from_id, m.user_to_id])),
		].filter(Boolean) as number[];
	}, [messages]);

  const userNames = useUserNames(allUserIds);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;
		if (!session.active) return <span>Page not available. Please login first.</span>;

		return (
			<>
				<div>
					<Link href="/messages">&lt;&lt; Back</Link>
				</div>
				<div>
					<h2>Private Message</h2>
					{messages.length > 0 && (
						<h4>Subject: {messages[0].subject}</h4>
					)}
					{messages.map((msg: any) => {
						return (
							<MessageThread
								key = {msg.id}
								id = {msg.id}
								user_from_id = {msg.user_from_id}
								user_to_id = {msg.user_to_id}
								subject = {msg.subject}
								body = {msg.body}
								reply_to_id = {msg.reply_to_id}
								thread_id = {msg.thread_id}
								date_created = {msg.date_created}
								userNames={userNames}
							/>
						);
					})}
				</div>
				<div className="mt-4 flex items-center border-t pt-2 p-2">
					<textarea
						value={replyText}
						maxLength={2000}
						onChange={(e) => setReplyText(e.target.value)}
						className="flex-1 border rounded px-2 py-1 mr-2 resize-none 
						overflow-hidden text-sm leading-tight focus:outline-none
						min-h-[28px] max-h-32"
						rows={1}
						placeholder="Type your reply..."
						onInput={(e) => {
							const el = e.currentTarget;
							el.style.height = "auto";
							el.style.height = el.scrollHeight + "px";
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend();
							}
						}}
					/>
					<button 
						onClick={handleSend}
						className="styled-button-1 w-20 mb-[1em]">
						Send
					</button>
				</div>
			</>
		)
	}

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{renderContent()}
				</div>
				<Footer />
			</div>
		</div>
	);
}