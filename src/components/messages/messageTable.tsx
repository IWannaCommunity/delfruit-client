import { useState } from "react";
import Link from "next/link";


// #region Test data
type Message = {
  id: number;
  from?: string;
  to?: string;
  subject: string;
  dateCreated: string;
};

const inboxMessages: Message[] = [
  {
    id: 1,
    from: "joe",
    subject: "hi",
    dateCreated: "Aug 25, 2025 10:13:00 PM",
  },
  {
    id: 2,
    from: "test",
    subject: "Hello",
    dateCreated: "Aug 25, 2025 10:13:00 PM",
  },
];

const outboxMessages: Message[] = [
  {
    id: 3,
    to: "joe",
    subject: "Re: Hi",
    dateCreated: "Aug 25, 2025 10:13:00 PM",
  },
  {
    id: 4,
    to: "test",
    subject: "Re: Hello",
    dateCreated: "Aug 25, 2025 10:13:00 PM",
  },
];
// #endregion

export default function MessageTable() {
  const [activeTab, setActiveTab] = useState<"inbox" | "outbox">("inbox");

  const messages = activeTab === "inbox" ? inboxMessages : outboxMessages;
  const headers =
    activeTab === "inbox" ? ["From", "Subject", "Date"] : ["To", "Subject", "Date"];

  return (
    <div className="border border-solid border-gray-400 rounded-md bg-white text-[1.1em] font-verdana">
      <div className="border border-gray-400 rounded-md p-[0.25em]">
        {/* Tabs row */}
        <div className="flex space-x-1 px-2 pt-2 border border-solid border-b-0 rounded-md border-gray-400 bg-gray-300">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-[1em] py-[0.5em] border border-gray-100 rounded-t-md font-verdana text-[1em] text-[#212121]
              ${
                activeTab === "inbox"
                  ? "bg-white border-b-0"
                  : "bg-gray-100 hover:bg-gray-200 hover:border-gray-300"
              }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setActiveTab("outbox")}
            className={`px-[1em] py-[0.5em] border border-gray-100 rounded-t-md font-verdana text-[1em] text-[#212121]
              ${
                activeTab === "outbox"
                  ? "bg-white border-b-0"
                  : "bg-gray-100 hover:bg-gray-200 hover:border-gray-300"
              }`}
          >
            Outbox
          </button>
        </div>

        {/* Table */}
				<div className="px-[1.5em]">
					<table className="text-center">
						<thead className="bg-gray-300 text-gray-500 font-bold">
							<tr>
								{headers.map((header) => (
									<th
										key={header}
										className="py-[0.1em] bg-[#d0d0d0] px-[1em]"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{messages.map((msg) => (
								<tr
									key={msg.id}
								>
									{msg.from && (
										<td>{msg.from}</td>
									)}
									{msg.to && (
										<td>{msg.to}</td>
									)}
									<td>
										<Link href="/" className="text-blue-600 hover:underline">
											{msg.subject}
										</Link>
									</td>
									<td>
										{msg.dateCreated}
									</td>
								</tr>
							))}
						</tbody>
        </table>
				</div>
      </div>
    </div>
  );
}