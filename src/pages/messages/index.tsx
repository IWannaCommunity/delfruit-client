import Head from "next/head";
import Header from "../../components/header";
import Footer from "@/components/footer";
import MessageTable from "../../components/messages/messageTable";
import { MessagesApi } from "delfruit-swagger-cg-sdk";
import { useEffect, useState } from "react";
import { AnyElem } from "@/utils/element";

const CFG: Config = require("../../config.json");
const MESSAGES_API_CLIENT = new MessagesApi(undefined, CFG.apiURL.toString());

export default function MessagePage(): AnyElem {
	
	const [messages, setMessages] = useState<MessageProps[]>([]);
	
	/*
	useEffect(() => {
		const fetchData = async () => {
			const results = await 
				MESSAGES_API_CLIENT.getMessagesFromInbox(true); // HARD-CODE TRUE FOR TESTING
			const messageProps: MessageProps[] = results.data.map((msg) => {
				id: msg.id;
				userFromId: msg.userFromId;
				userToId: msg.userToId;
				subject: msg.subject;
				body: msg.body;
				dateCreated: msg.dateCreated;
				replyToId: msg.replyToId;
				threadId: msg.threadId;
			});
			setMessages(messageProps);
		}
		fetchData();
	}, []);
	*/
				
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>My Private Messages</h2>
					<a className="standalone" href="/">Send a message...</a>
					<MessageTable messages={messages}/>
				</div>
				<Footer />
			</div>
		</div>
	);
}