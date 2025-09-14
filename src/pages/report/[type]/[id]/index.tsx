import Footer from "@/components/footer";
import Header from "@/components/header";
import Review from "@/components/review";
import { AnyElem } from "@/utils/element";
import { useEffectAsync, useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { 
	ReportTypeEnum,
	Report as ReportT, 
	Review as ReviewT
} from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { formatDate } from "@/utils/formatDate";

export default function Report(): AnyElem {
	const [session] = useSessionContext();
	const [reviewDetails, setReviewDetails] = useState<ReviewT>(undefined);
	const [game, setGame] = useState<string | null>(null);
	const [user, setUser] = useState<string | null>(null);
	const [type, setType] = useState<ReportTypeEnum | null>(null);
	const [targetId, setTargetId] = useState<number | null>(null);
	const [report, setReport] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffectAsync(async () => {
		if (router.isReady) {
			const qType = router.query.type;
			const qId = Number(router.query.id);

			if (typeof qType === "string" && Object.values(ReportTypeEnum).includes(qType as ReportTypeEnum)) {
				setType(qType as ReportTypeEnum);
			} else {
				router.push("/report");
			}
			
			if (isNaN(qId) || qId < 0 || !qId) {
				router.push("/report");
			} else {
				setTargetId(qId);
			}

			switch(qType) {

				case ReportTypeEnum.Review: {
					try {
						const resp = await API.reviews().getReview(qId);
						setReviewDetails({
							id: Number(resp.data.id),
							user_id: Number(resp.data.user_id),
							game_id: null,
							user_name: resp.data.user_name,
							game_name: resp.data.game_name,
							date_created: formatDate(new Date(resp.data.date_created)),
							removed: resp.data.removed,
							comment: resp.data.comment,
							rating:
								resp.data.rating === null
									? null
									: Number(resp.data.rating / 10).toFixed(1),
							difficulty:
								resp.data.difficulty === null ? null : Number(resp.data.difficulty),
							like_count: Number(resp.data.like_count),
							owner_review: resp.data.owner_review === 1,
							tags: resp.data.tags,
						});
					} catch (err: any) {
						router.push("/report");
					} finally {
						setLoading(false);
					}
					break;
				}

				case ReportTypeEnum.Game: {
					try {
						const resp = await API.games().getGame(qId);
						setGame(resp.data.name);
					} catch (err: any) {
						router.push("/report");
					} finally {
						setLoading(false);
					}
					break;
				}

				case ReportTypeEnum.User: {
					try {
						const resp = await API.users().getUser(qId);
						setUser(resp.data.name);
					} catch (err: any) {
						router.push("/report");
					} finally {
						setLoading(false);
					}
					break;
				}

				default: {
					setLoading(false);
					break;
				}

			}
		}
	},
	async () => {},
	[router, router.isReady, router.query.id, router.query.type],
	);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!type || !targetId || !report) return;

		const body: ReportT = {
			type,
			targetId,
			report,
		}

		try {
			const response = await API.reports().postReport(body, `Bearer ${session.token}`);
			const createdReport = response.data;
			router.push(`/report/submit?id=${createdReport.id}`);
		} catch (err: any) {
			setError("Failed to submit report. Please try again.");
		}
	}

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (!session.active) {
			return (
				<>
					<p>
						<span>Submitting a report requires an account. Please </span>
						<Link href="/login">login</Link> to add a game.
					</p>
					<p>
						<span>Don't have an account? Registering is quick and easy! </span>
						<Link href="/register">Click here</Link> to start your account!
					</p>
				</>
			);
		}

		return (
			<>
				<p>
					You are submitting a report for the following {type}: 
					<span className="font-bold ml-1">{game && <>{game}</>}</span>
				</p>
				{user && <h2>{user}</h2>}
				{reviewDetails && (
					<Review
						key={reviewDetails.id}
						id={reviewDetails.id}
						user_id={reviewDetails.user_id}
						game_id={reviewDetails.game_id}
						rating={reviewDetails.rating}
						difficulty={reviewDetails.difficulty}
						comment={reviewDetails.comment}
						date_created={reviewDetails.date_created}
						removed={reviewDetails.removed}
						user_name={reviewDetails.user_name}
						game_name={reviewDetails.game_name}
						like_count={reviewDetails.like_count}
						owner_reviewDetails={reviewDetails.owner_reviewDetails}
						tags={reviewDetails.tags}
					/>
				)}
				<p>Reasons can include:</p>
				{reviewDetails && (
					<ul>
						<li>Offensive content</li>
						<li>Off-topic content</li>
						<li>Messages directed toward other users</li>
						<li>
							<a
								href="http://www.reddit.com/r/TheoryOfReddit/comments/1faqdm/downvoting_all_of_a_users_comments/">
								Witchhunt downvotes
							</a>
						</li>
					</ul>
				)}
				{game && (
					<ul>
						<li>Invalid name</li>
						<li>Incorrect Author(s)</li>
						<li>Broken link</li>
						<li>Link takedown request</li>
						<li>Offensive content</li>
						<li>Ownership Request</li>
					</ul>
				)}
				{user && (
					<ul>
						<li>Impersonation</li>
						<li>Offensive content</li>
					</ul>
				)}
				<p>
					Please do not submit reports out of anger, or otherwise without a
					clear and valid reason. Abuse of the system will lead to your
					reporting privileges being revoked.
				</p>
				<p>If you would like to continue, please fill out the form below.</p>
				<form onSubmit={handleSubmit}>
					<textarea 
						name="report"
						value={report}
						maxLength={2000}
						onChange={(e) => setReport(e.target.value)}
						required
					/>
					<input type="submit" value="Submit Report" />
					{error && <span className="text-red-600 ml-1">{error}</span>}
				</form>
			</>
		);
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
