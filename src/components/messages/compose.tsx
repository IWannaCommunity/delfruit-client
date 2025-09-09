import { AnyElem } from "@/utils/element";
import { useState, useEffect } from "react";
import { useSessionContext } from "@/utils/hooks";
import { MessagesApi, UsersApi, Message as MessageT, UserExt as UserT } from "delfruit-swagger-cg-sdk";
import { useRouter } from "next/router";
import { Config } from "@/utils/config";

const CFG: Config = require("@/config.json");
const MESSAGES_API_CLIENT = new MessagesApi(undefined, CFG.apiURL.toString());
const USERS_API_CLIENT = new UsersApi(undefined, CFG.apiURL.toString());

export default function ComposePage(): AnyElem {

	const [session] = useSessionContext();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchResults, setSearchResults] = useState<UserT[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserT | null>(null);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [formData, setFormData] = useState({
		to: "",
		subject: "",
		message: "",
	});
	const [lastRecipient, setLastRecipient] = useState<string | null>(null);

	const router = useRouter();

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({...prev,[name]: value}));

		if (name === "to") {
      setSelectedUser(null);
			setDropdownVisible(true);
		}
	}

	useEffect(() => {
		if (!router.isReady) return;

		const userIdParam = router.query.to;
		if (userIdParam) {
			(async () => {
				try {
					const res = await USERS_API_CLIENT.getUser(Number(userIdParam));
					const user = res.data;
					setSelectedUser(user);
					setFormData((prev) => ({ ...prev, to: user.name }));
				} catch (err) {
					setError("User not found.");
				}
			})();
		}
	}, [router.isReady, router.query.to, session.token]);

	useEffect(() => {
    if (!dropdownVisible || !formData.to || formData.to.length < 2) {
      setSearchResults([]);
      return;
    }

		const timer = setTimeout(async () => {

			try {
				const res = await USERS_API_CLIENT.getUsers(
					`Bearer ${session.token}`,
					formData.to,
					undefined,
					false,
					0,
					10
				);
				setSearchResults(res.data);
			} catch (err) {
				setError("User search failed.");
				setSuccess(false);
			}
		}, 300); // 300ms limit to not spam api calls per key stroke

		return () => clearTimeout(timer);

  }, [formData.to, session.token, dropdownVisible]);

	const handleSelectUser = (user: UserT) => {
    setSelectedUser(user);
    setFormData((prev) => ({ ...prev, to: user.name }));
		setDropdownVisible(false);
    setSearchResults([]);
  };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		
		if (!selectedUser) {
			setError("Please select a user first.");
			setSuccess(false);
      return;
    }

		const message: MessageT = {
			userToId: selectedUser.id,
			subject: formData.subject,
			body: formData.message,
		};

		if (message.userToId === session.user_id) {
			setError("Cannot send a message to yourself!");
			setSuccess(false);
			return;
		}

		if (message.subject === null || message.subject === "") {
			setError("Enter a subject!");
			setSuccess(false);
			return;
		}

		if (message.body === null || message.body === "") {
			setError("Enter a message!");
			setSuccess(false);
			return;
		}

		try {
			await MESSAGES_API_CLIENT.postMessage(message, `Bearer ${session.token}`);
			setLastRecipient(selectedUser?.name ?? null);
			setFormData({ to: "", subject: "", message: "" });
			setSelectedUser(null);
			setSuccess(true);
			setError(null);
		} catch (error) {
			setError("Failed to send message. Please try again.");
			setSuccess(false);
		}
	};

	return (
		<>
			<h2>Send a PM</h2>
			<form onSubmit={handleSubmit}>
				<div className="relative">
					<label htmlFor="to" className="ml-9">To: </label>
					<input
						id="to"
						type="text"
						name="to"
						value={formData.to}
						onChange={handleChange}
						autoComplete="off"
					/>
					{searchResults.length > 0 && (
						<ul
							className="absolute z-10 mt-1 w-[50em] rounded-md border border-gray-200 
							bg-white shadow-lg list-none px-5 mx-[4em]"
						>
							{searchResults.map((user) => (
								<li
									key={user.id}
									onMouseDown={() => handleSelectUser(user)}
									className="cursor-pointer py-1 hover:bg-gray-100"
								>
									{user.name}
								</li>
							))}
						</ul>
          )}
				</div>

				<div>
					<label htmlFor="subject">Subject: </label>
						<input
							id="subject"
							type="text"
							name="subject"
							maxLength={100}
							value={formData.subject}
							onChange={handleChange}
						/>
				</div>

				<div>
					<label htmlFor="message">Message:</label>
					<br />
					<textarea
						id="message"
						name="message"
						maxLength={5000}
						value={formData.message}
						onChange={handleChange}
					/>
				</div>

				<div>
					<button type="submit">Send</button>
					{error && !success && <span className="text-red-600 ml-1">{error}</span>}
					{success && !error && <span className="text-green-600 ml-1">Message sent to {lastRecipient}!</span>}
				</div>
			</form>
		</>
	);
}