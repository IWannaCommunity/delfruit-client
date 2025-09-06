import Footer from "@/components/footer";
import Header from "@/components/header";
import Review from "@/components/review";
import { Config } from "@/utils/config";
import { AnyElem } from "@/utils/element";
import { useEffectAsync, useSessionContext } from "@/utils/hooks";
import {
	ReportsApi,
	Review as ReviewT,
	ReviewsApi,
} from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const CFG: Config = require("@/config.json");

const REVIEWSAPI: ReviewsApi = new ReviewsApi(void 0, CFG.apiURL.toString());
const REPORTSAPI: ReportsApi = new ReportsApi(void 0, CFG.apiURL.toString());

export default function Report(): AnyElem {
	const router = useRouter();
	const [session, _] = useSessionContext();

	const [reviewDetails, setReviewDetails] = useState<ReviewT>(undefined);

	const id = Number(router.query.id);

	useEffectAsync(
		async () => {
			if (!router.isReady) {
				return;
			}
			const resp = await REVIEWSAPI.getReview(id);
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
		},
		async () => {},
		[router.isReady, id],
	);

	async function actionReportReview(
		evt: FormEvent<HTMLFormElement>,
	): Promise<void> {
		evt.preventDefault();

		const frmData = new FormData(evt.currentTarget);
		const report = frmData.get("report");

		REPORTSAPI.postReport(
			{
				report: report.toString(),
				reporterId: session.user_id,
				reporterName: session.username,
			},
			session.token,
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
					<p>You are submitting a report for the following review:</p>
					{router.isReady && reviewDetails && (
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
					<ul>
						<li>Offensive content</li>
						<li>Off-topic content</li>
						<li>Messages directed toward other users</li>
						<li>
							{" "}
							<a href="http://www.reddit.com/r/TheoryOfReddit/comments/1faqdm/downvoting_all_of_a_users_comments/">
								Witchhunt downvotes
							</a>
						</li>
					</ul>
					<p>
						Please do not submit reports out of anger, or otherwise without a
						clear and valid reason. Abuse of the system will lead to your
						reporting privileges being revoked.
					</p>
					<p>If you would like to continue, please fill out the form below.</p>
					{session.active ? (
						<form onSubmit={actionReportReview}>
							<textarea name="report" />
							<input type="submit" value="Submit Report" />
						</form>
					) : (
						<>
							<p>
								Submitting a report requires an account. Please{" "}
								<Link href="/login">login</Link> to add a game.
							</p>
							<p>
								Don't have an account? Registering is quick and easy!{" "}
								<Link href="/register">Click here</Link> to start your account!
							</p>
						</>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
