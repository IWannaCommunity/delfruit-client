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
	const [screenshotApproval, setScreenshotApproval] = useState<boolean | null>(null);
	const [screenshotRemoved, setScreenshotRemoved] = useState<boolean | null>(null);
	const [screenshotExists, setScreenshotExists] = useState<boolean | null>(null);
	const [screenshotDescription, setScreenshotDescription] =
		useState<string>("");
	const [adminRemoveScreenshotText, setAdminRemoveScreenshotText] =
		useState<string>("");

	const id = Number(router.query.id);

	useEffect(() => {
		if (!router.isReady || !id) {
			return;
		}

		(async () => {
			try {
				const resp = await API.screenshots().getScreenshot(id);

				setScreenshotExists(true);
				setScreenshotURL(makeScrnshotURL(resp.data.gameId, resp.data.id));
				setScreenshotDescription(resp.data.description);
				setScreenshotApproval(resp.data.approved);
				setScreenshotRemoved(resp.data.removed);

				const gameResp = await API.games().getGame(String(resp.data.gameId));
				setScreenshotGameName(gameResp.data.name);
			} catch (e) {
				setScreenshotExists(false);
			}
		})();
	}, [router.isReady, id]);

	async function actionAdminRemoveScreenshot() {
		try {
			await API.screenshots().deleteScreenshot(id);
			setAdminRemoveScreenshotText("Screenshot removed.");
		} catch (e) {
			setAdminRemoveScreenshotText("Error: Rejected, request did not finish.");
		}
	}

	async function actionAdminApproveScreenshot() {
		try {
			await API.screenshots().patchScreenshot(
				{ 
					approved: true,
					approvedById: session.user_id
				},
				`Bearer ${session.token}`, 
				id
			);
			setScreenshotApproval(true);
			setAdminRemoveScreenshotText("Screenshot approved.");
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
					{screenshotExists === null ? (
						<p>Loading screenshot...</p>
					) : !screenshotExists ? (
						<p>This screenshot does not exist</p>
					) : screenshotRemoved ? (
						<p>This screenshot has been deleted</p>
					) : (
						<>
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
										{screenshotApproval ? (
											<button
												type="button"
												onClick={actionAdminRemoveScreenshot}
											>
												Remove Screenshot
											</button>
										) : (
											<>
												<button
													type="button"
													onClick={actionAdminApproveScreenshot}
												>
													Approve
												</button>
												<button
													type="button"
													onClick={actionAdminRemoveScreenshot}
												>
													Deny
												</button>
											</>
										)}
										<p>{adminRemoveScreenshotText}</p>
									</p>
								</>
							)}
						</>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
