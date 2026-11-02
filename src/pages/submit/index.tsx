import Head from "next/head";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useSessionContext } from "@/utils/hooks";
import { useState, useEffect } from "react";
import { API } from "@/utils/api";
import type { PostGameParams } from "delfruit-swagger-cg-sdk";
import Captcha from "@/components/captcha";

export default function SubmitGame(): AnyElem {

	const [session] = useSessionContext();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [captchaToken, setCaptchaToken] = useState<string>("");

	const [name, setName] = useState("");
	const [creators, setCreators] = useState("");
	const [dlUrl, setDlUrl] = useState("");
	const [date, setDate] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		setError(null);
		setSuccess(false);

		if (!name.trim()) {
			setError("Enter a game name.");
			setSuccess(false);
			return;
		}

		if (!captchaToken) {
			setError("Please complete the CAPTCHA.");
			setSuccess(false);
			return;
		}

		const authors = creators
			.split(",")
			.map(author => author.trim())
			.filter(author => author.length > 0);

		const body: PostGameParams = {
			name: name.trim(),
			author: authors.length > 0 ? authors : ["Unknown"],
			collab: authors.length > 1,
			url: dlUrl.trim() || undefined,
			dateCreated: date ? new Date(date) : new Date(),
		};

		const frmData = new FormData(
			document.getElementById("captchaContainer") as HTMLFormElement,
		);
		const proof = frmData.get("cf-turnstile-response");

		if (!proof) {
			setError("Please complete the CAPTCHA.");
			setSuccess(false);
			return;
		}

		try {
			await API.games().postGame(
				body,
				proof.toString(),
				`Bearer ${session.token}`
			);

			setSuccess(true);

			setName("");
			setCreator("");
			setDlUrl("");
			setDate("");
			setCaptchaToken("");

		} catch (err: any) {
			setError("Failed to submit game.");
			setSuccess(false);
		}
	}

	const renderContent = () => {
		if (!session.active || !session.admin) {
			return <span>You do not have access to this page</span>;
		}

		return (
			<>
				<h2>Submit Game</h2>

				<form
					onSubmit={handleSubmit}
					className="mb-5 flex items-center gap-2"
				>
					<div className="flex flex-col gap-2 mt-[1em] !mb-[2em]">
						<label className="group flex items-center gap-2">
							<span className="w-40 group-focus-within:font-bold">Game Name:</span>
							<input
								id="game_name"
								name="game_name"
								type="text"
								className="flex-1 w-[500px]"
								value={name}
								onChange={(e) => {
									setName(e.target.value)
									setSuccess(false);
									setError(null);
								}}
							/>
						</label>

						<label className="group flex items-center gap-2">
							<span className="w-40 group-focus-within:font-bold">Creator(s):</span>
							<input
								id="creators"
								name="creators"
								type="text"
								className="flex-1 w-[500px]"
								value={creators}
								onChange={(e) => {
									setCreator(e.target.value)
									setSuccess(false);
									setError(null);
								}}
							/>
						</label>

						<label className="group flex items-center gap-2">
							<span className="w-40 group-focus-within:font-bold">DL Link:</span>
							<input
								id="dl_link"
								name="dl_link"
								type="text"
								className="flex-1 w-[500px]"
								value={dlUrl}
								onChange={(e) => {
									setDlUrl(e.target.value)
									setSuccess(false);
									setError(null);
								}}
							/>
						</label>

						<label className="group flex items-center gap-2">
							<span className="w-40 group-focus-within:font-bold">Release Date:</span>
							<input
								id="release_date"
								name="release_date"
								type="date"
								className="flex-1 w-[500px]"
								value={date}
								onChange={(e) => {
									setDate(e.target.value)
									setSuccess(false);
									setError(null);
								}}
							/>
						</label>
						<input type="submit" className="w-40 ml-20 mt-3 self-center"/>
						{error && !success && <span className="text-red-600 ml-1">{error}</span>}
						{success && !error && <span className="text-green-600 ml-1">Game Submitted!</span>}
					</div>
				</form>
			</>
		);
	};
		
  return (
    <div>
      <Head>
        <title>
          Submit Game - Delicious Fruit
        </title>
      </Head>
      <div id="container">
        <Header />
        <div id="content">{renderContent()}</div>
        <Footer />
      </div>
    </div>
	);
}