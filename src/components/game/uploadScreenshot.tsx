import { AnyElem } from "@/utils/element";
import Image from "next/image";
import { useSessionContext } from "@/utils/hooks";
import { useState } from "react";
import { GamesApi } from "delfruit-swagger-cg-sdk";
import Link from "next/link";

const CFG: Config = require("@/config.json");
const GAMES_API_CLIENT = new GamesApi(undefined, CFG.apiURL.toString());

export type GameProps = {
	id: number,
	name: string
}

type UploadScreenshotProps = {
	game: GameProps
}

export default function UploadScreenshot({ game }: UploadScreenshotProps): AnyElem {
	const [session, setSession] = useSessionContext();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

	if (!game) {
		return <h4>Loading...</h4>;
	}

	async function handleSubmit(e: React.FormEvent) {
			e.preventDefault();
			setLoading(true);
			setError(null);
	
			try {
				if (!file) { throw new Error("Please select a file"); }

				const token = session.token;
	
				await GAMES_API_CLIENT.postGameScreenshotForm(description, file, `Bearer ${token}`, game.id);

				setSuccess(true);
				setError(null);
			} catch (err: any) {
				setError("Failed to upload screenshot. Please try again.");
			} finally {
				setLoading(false);
			}
		}

	return (
		<>
			<h1>Screenshot Upload</h1>
			<h2>
				<Link className="no-underline" href={`/game/${game.id}`}>
					{game.name}
				</Link>
			</h2>
			<form onSubmit={handleSubmit}>
				<div>
					{file ? (
						<img
							src={URL.createObjectURL(file)}
							alt="Screenshot Preview"
							width={200}
							height={150}
							onLoad={(e) => { URL.revokeObjectURL((e.target as HTMLImageElement).src); }}
						/>
					) : (
						<Image src="/images/noimage.png" alt="Placeholder" width={200} height={150}/>
					)}
				</div>
				<hr/>
				<div>
					<span> Description: (100 character max)</span>
					<br/>
					<input 
						className="w-full" 
						type="text"
						maxLength={100}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<span>{description.length} / 100 characters</span>
				</div>
				<div>
					<div>
						<p>
							Select an image to upload: (max filesize: 1MB, max image size: 1024x768, JPG/PNG only)
						</p>
						<input 
							type="file"
							accept="image/png,image/jpeg"
							onChange={(e) => {
								if (e.target.files?.[0]) {
									setFile(e.target.files[0]);
									setSuccess(false);
								}
							}}
						/>
						<br/>
						<input type="submit" value={loading ? "Uploading..." : "Upload"} />
						{success && !error && (
							<span className="text-green-600 ml-1">
								Screenshot successfully uploaded!
							</span>
						)}
						<br/>
					</div>
					<p className="mb-0">
						The best screenshots include the title screen & a couple of
						representative screens from the game.
						<br/>
						<span className="font-bold">Please,</span>
					</p>
					<ul className="mt-0">
						<li>Do not upload clear screenshots</li>
						<li>
							Do not upload spoilers (secrets, clear screens, etc...)
							will be removed if found to be significant.
						</li>
						<li>
							When taking a screenshot to upload, please consider using the ingame
							screenshot button (F9 by default). If it doesn't exist, please include
							a screenshot of the game itself and not include the window border.
						</li>
						<li>
							If a screenshot for the game doesn't exist,
							consider uploading a screenshot of the title screen.
						</li>
						<li>Do not submit too many similar screenshots</li>
						<li>Do not upload a screenshot of glitches or bugs that the game might contant.</li>
					</ul>
					<p>
						<span>By uploading a screenshot, you release your work under the </span>
						<a href="http://creativecommons.org/licenses/by-sa/3.0/">
							Creative Commons by-sa 3.0 license.
						</a>
					</p>
					<p className="text-[0.85em]">
						<span>'No image' Icon made by </span>
						<a href="https://www.flaticon.com/authors/daniel-bruce">
							Daniel Bruce
						</a>
						<span> from </span>
						<a href="www.flaticon.com">
							www.flaticon.com
						</a>
					</p>
				</div>
			</form>
			{error && <span className="text-red-600"> {error}</span>}
		</>
	);
}