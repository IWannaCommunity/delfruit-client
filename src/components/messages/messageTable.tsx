import { useState } from "react";
import Link from "next/link";
import TabBar from "@/components/tabBar";

// #region Test data
type Message = {
  id: number;
  from?: string;
  to?: string;
  subject: string;
  dateCreated: string;
};

const inboxMessages: Message[] = [
  { id: 1, from: "joe", subject: "hi", dateCreated: "Aug 25, 2025 10:13:00 PM" },
  { id: 2, from: "test", subject: "Hello", dateCreated: "Aug 25, 2025 10:13:00 PM" },
];

const outboxMessages: Message[] = [
  { id: 3, to: "joe", subject: "Re: Hi", dateCreated: "Aug 25, 2025 10:13:00 PM" },
  { id: 4, to: "test", subject: "Re: Hello", dateCreated: "Aug 25, 2025 10:13:00 PM" },
];
// #endregion

export default function MessageTable(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"inbox" | "outbox">("inbox");

  const tabs = [
    { label: "Inbox", value: "inbox" },
    { label: "Outbox", value: "outbox" },
  ];

  const messages = activeTab === "inbox" ? inboxMessages : outboxMessages;
  const headers =
    activeTab === "inbox" ? ["From", "Subject", "Date"] : ["To", "Subject", "Date"];

  return (
    <div className="border border-solid border-gray-400 rounded-md bg-white text-[1.1em] font-verdana">
      <div className="border border-gray-400 rounded-md p-[0.25em]">
        
				{/* Tabs */}
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Table */}
        <div className="px-[1.5em]">
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
              {messages.map((msg) => (
                <tr key={msg.id}>
                  {msg.from && <td>{msg.from}</td>}
                  {msg.to && <td>{msg.to}</td>}
                  <td>
                    <Link href="/" className="text-blue-600 hover:underline">
                      {msg.subject}
                    </Link>
                  </td>
                  <td>{msg.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}