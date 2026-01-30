import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { makeScrnshotURL } from "@/utils/url";
import { API } from "@/utils/api";
import { useSessionContext } from "@/utils/hooks";

export default function Screenshot(): AnyElem {
	const router = useRouter();

	const [session] = useSessionContext();

	const [screenshotURL, setScreenshotURL] = useState<URL>(undefined);
	const [screenshotGameName, setScreenshotGameName] = useState<string>("");
	const [screenshotDescription, setScreenshotDescription] =
		useState<string>("");
	const [adminRemoveScreenshotText, setAdminRemoveScreenshotText] =
		useState<string>("");

	const id = Number(router.query.id);

	useEffect(() => {
		if (!router.isReady) {
			return;
		}

		(async () => {
			const gameId = await (async () => {
				const resp = await API.screenshots().getScreenshot(id);
				setScreenshotURL(makeScrnshotURL(resp.data.gameId, resp.data.id));
				setScreenshotDescription(resp.data.description);
				return resp.data.gameId;
			})();

			const resp = await API.games().getGame(String(gameId));
			setScreenshotGameName(resp.data.name);
		})();
	}, [router.isReady, id]);

	async function actionAdminRemoveScreenshot() {
		try {
			await API.screenshots().deleteScreenshot(`Bearer ${session.token}`, id);
			setAdminRemoveScreenshotText("Screenshot removed.");
		} catch (e) {
			setAdminRemoveScreenshotText("Error: Rejected, request did not finish.");
		}
	}

	return (
		<div>
			<Head>
				<title>Screenshot - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<p>Screenshot for</p>
					<h2>{screenshotGameName}</h2>
					<Image
						className="w-full"
						alt=""
						src={screenshotURL?.toString()}
						width={-1}
						height={-1}
					/>
					<p>
						<span>{screenshotDescription}</span>
						<br />
						{session.active && (
							<Link href={`/report/screenshot/${router.query.id}`}>
								Report this image
							</Link>
						)}
					</p>

					{session.admin && (
						<>
							<h2>Admin Tools</h2>
							<p id="admin_controls">
								<button
									type="submit"
									onClick={async (
										evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
									) => {
										evt.preventDefault();
										await actionAdminRemoveScreenshot();
									}}
								>
									Remove Screenshot
								</button>
								<p>{adminRemoveScreenshotText}</p>
							</p>
						</>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
