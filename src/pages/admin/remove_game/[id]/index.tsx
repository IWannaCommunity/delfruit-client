import type { Game } from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Captcha from "@/components/captcha";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";

export default function RemoveGame(): AnyElem {
	const [session] = useSessionContext();
	const [game, setGame] = useState<Game | null>(null);
	const [captchaToken, setCaptchaToken] = useState<string>("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

  function sanitizeGameForPatch(game: Game): Game {
    return {
      id: game.id,
      name: game.name ?? "",
      url: game.url ?? "",
      author: Array.isArray(game.author) ? game.author : [],
      author_raw: Array.isArray(game.author) ? game.author.join(" ") : "",
      removed: Boolean(game.removed)
    };
  }

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!session.active || !session.admin || !session.token || !game) {
			setError("You are not authorized to perform this action.");
			return;
		}

		if (!captchaToken) {
			setError("Please complete the CAPTCHA.");
			setSuccess(false);
			return;
		}

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
			const g = sanitizeGameForPatch({
				...game,
				removed: true,
			} as Game);

			await API.games().patchGame(g, `Bearer ${session.token}`, game.id);

			setSuccess(true);

			setTimeout(() => {
				router.replace("/");
			}, 3000);
		} catch {
			setError("Failed to remove game.");
			setSuccess(false);
		}
	}

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		if (isNaN(id) || id <= 0) {
			setError("Invalid game ID");
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await API.games().getGame(id);
				if (!resp.data) {
					setError("Game not found");
					return;
				}
				setGame({
					id: Number(resp.data.id),
          name: resp.data.name,
          url: resp.data.url,
          author: resp.data.author,
					removed: resp.data.removed
        });
			} catch {
				setError("Failed to load game.");
			} finally {
				setLoading(false);
			}
		})();
	}, [router, router.isReady, router.query.id]);

	const renderContent = () => {
		if (!session.active || !session.admin) {
			return <span>You do not have access to this page</span>;
		}

		if (loading) return <span>Loading...</span>;

		if (success) {
			return (
				<span className="font-semibold">
					Game successfully removed.
				</span>
			);
		}

		if (!game) return null;

		return (
			<>
				<h2>Remove Game</h2>

				<p className="mb-4">
					Are you sure you want to remove the game:
				</p>

				<h1 className="break-words">{game.name}</h1>

				{/* Creator */}
				<h2 id="creator-label" className="mb-[13px]">
					<span>
						{game.author.length === 1 ? "Creator: " : "Creators: "}
					</span>

					{game.author.length > 0 &&
						game.author.map((author, i, arr) => {
							const trimmed = author.trim();

							return (
								<React.Fragment key={trimmed}>
									<Link href={`/search/?author=${trimmed}`}>
										{trimmed}
									</Link>
									{i < arr.length - 1 && ", "}
								</React.Fragment>
							);
						})}
				</h2>

				{/* Download link */}
				{game.url ? (
					<Link
						target="_blank"
						className="standalone"
						id="game-link"
						href={game.url}
					>
						<Image
							src="/images/download.png"
							className="absolute ml-[2px]"
							width={14}
							height={14}
							alt="Download Game"
						/>
						<span>&nbsp;&nbsp;&nbsp;&nbsp; Download Game</span>
					</Link>
				) : (
					<span id="no-link" className="inline-block pb-[1em] mr-1">
						[Download Not Available]
					</span>
				)}

				<form
					id="captchaContainer"
					className="mt-4"
					onSubmit={handleSubmit}
				>
					<Captcha onSuccess={setCaptchaToken} />
					<br />

					<input
						type="submit"
						value="Remove"
						className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
					/>

					{error && !success && (
						<span className="text-red-600 ml-2">
							{error}
						</span>
					)}
				</form>
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>Remove Game - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">{renderContent()}</div>
				<Footer />
			</div>
		</div>
	);
}
