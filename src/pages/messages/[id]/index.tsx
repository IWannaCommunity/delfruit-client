import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "@/components/header";
import MessageThread from "@/components/messages/messageThread";
import { AnyElem } from "@/utils/element";
import { useUserNames } from "@/utils/userNameCache";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { Message as MessageT } from "delfruit-swagger-cg-sdk";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

export default function MessagePage(): AnyElem {

	const [session] = useSessionContext();
	const [messages, setMessages] = useState<MessageT[]>([]);
	const [replyText, setReplyText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cooldown, setCooldown] = useState(0);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const router = useRouter();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	};

	// #region fetchMessages(id)
	/*
	* useCallback function, calls API to retrieve messages
	* @returns Message[]
	*/
	const fetchMessages = useCallback(async (id: number) => {
		const resp = await API.messages().getMessagesFromThread(
			`Bearer ${session.token}`, // authorization
			id, // id
		);
		return resp.data;
	}, [session.token]);
	// #endregion

	// #region handleSend()
	/*
	* Handler and logic for sending a message
	* Does a POST request on API
	* Then refreshes all messages again after
	* Then starts reply cooldown
	*/
	const handleSend = async () => {
		if (cooldown > 0) { return; }

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
				setCooldown(5);
			}
		} catch (err) {
			setError("Failed to send message");
		} finally {
			scrollToBottom();
		}
	};
	// #endregion

	// #region
	/*
	* useEffect for counting down the cooldown timer
	*/
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (cooldown > 0) {
			interval = setInterval(() => {
				setCooldown((prev) => {
					if (prev <= 1) {
						if (interval) clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [cooldown]);
	// #endregion

	// #region
	/*
	* useEffect for loading the page and populating messages initially
	* Calls the fetchMessages function and passes query id to it
	*/
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
				if (data.length === 0) {
					setError("This is an invalid thread, or you are not a participant.");
					return;
				}
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
	}, [fetchMessages, router.isReady, router.query.id]);
	// #endregion

	// #region
	/*
	* useEffect for auto scrolling to the bottom
	*/
	useEffect(() => {
		scrollToBottom();
	}, [messages]);
	// #endregion

	// #region
	/*
	* useMemo for displaying dynamic cooldown text
	*/
	const cooldownText = useMemo(() => {
		return cooldown > 0 ? `Wait ${cooldown}s` : "Send";
	}, [cooldown]);
	// #endregion

	// #region
	/*
	* useMemo for filtering non-unique userIDs
	* Then uses the userNameCache util to store usernames in cache
	* to reduce repeated API calls
	*/
	const allUserIds = useMemo(() => {
		return [
			...new Set(messages.flatMap((m) => [m.user_from_id, m.user_to_id])),
		].filter(Boolean) as number[];
	}, [messages]);

	const userNames = useUserNames(allUserIds);
	// #endregion

	// #region renderContent()
	/*
	 * Determines what is to be rendered to the screen
	 * @returns JSX.Element
	*/
	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;
		if (!session.active) return <span>Page not available. Please login first.</span>;

		return (
			<>
				<div id="content">
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
									key={msg.id}
									id={msg.id}
									user_from_id={msg.user_from_id}
									user_to_id={msg.user_to_id}
									subject={msg.subject}
									body={msg.body}
									reply_to_id={msg.reply_to_id}
									thread_id={msg.thread_id}
									date_created={msg.date_created}
									userNames={userNames}
								/>
							);
						})}
						
					</div>
				</div>
				<div className="fixed bottom-0 left-[43em] right-[43em] bg-white border-t rounded-md mb-2 pt-4 px-2 flex items-center">
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
						type="button"
						disabled={cooldown > 0}
						className={`styled-button-1 w-20 mb-[1em] ${cooldown > 0 ? "opacity-50" : ""}`}
					>
						{cooldownText}
					</button>
				</div>
			</>
		)
	}
	// #endregion

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				{renderContent()}
			</div>
			<div ref={messagesEndRef} />
		</div>
	);
}