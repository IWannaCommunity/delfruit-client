import Head from "next/head";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";
import Link from "next/link";
import { useSessionContext } from "@/utils/hooks";
import { useState } from "react";
import { API } from "@/utils/api";

export default function WriteNews(): AnyElem {
  const [session] = useSessionContext();
	const [title, setTitle] = useState("");
	const [short, setShort] = useState("");
	const [news, setNews] = useState("");

	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		setError(null);
		setSuccess(false);

		const body: any = {
			posterId: session.user_id,
			title,
			short,
			news,
			dateCreated: new Date().toISOString().substring(0,10),
			removed: false
		};

		try {
			await API.news().postNews(
				body,
				`Bearer ${session.token}`
			);
			setSuccess(true);
			setError(null);
		} catch (err: any) {
			if (err.response) {
				setError("An error has occured. Please try again.");
				setSuccess(false);
			}
		}
	}

  const renderContent = () => {
    if (!session.active || !session.admin) {
      return <span>You do not have access to this page</span>;
    }

    return (
	<>
		<h2>Add a news item</h2>
		<p>
			<>Note: we support </> 
			<a href="https://en.wikipedia.org/wiki/BBCode">BBCode</a>
			<> in news, so feel free to mark up your post!</>
		</p>
		<form onSubmit={handleSubmit}>
			<label className="group">
				<span className="group-focus-within:font-bold">Title: </span>
				<input
							id="title"
							name="title"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value)
								setSuccess(false);
								setError(null);
							}}
						/>
			</label>
			<br/>
			<br/>
			<label className="group">
				<span className="group-focus-within:font-bold">
					Short Version: (This will be displayed on the index page, so keep it brief!)
				</span>
				<br/>
				<textarea
							id="short"
							name="short"
							value={short}
							onChange={(e) => {
								setShort(e.target.value)
								setSuccess(false);
								setError(null);
							}}
						/>
			</label>
			<label className="group">
				<span className="group-focus-within:font-bold">Content:</span>
				<br/>
				<textarea
							id="news"
							name="news"
							value={news}
							onChange={(e) => {
								setNews(e.target.value)
								setSuccess(false);
								setError(null);
							}}
						/>
			</label>
			<input type="submit" value="Submit"/>
			{error && !success && <span className="text-red-600 ml-1">{error}</span>}
			{success && !error && <span className="text-green-600 ml-1">News posted!</span>}
		</form>
		<br/>
		<Link href="/admin/0" className="standalone">Return to admin page</Link>
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