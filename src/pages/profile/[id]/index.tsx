import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TabBar from "@/components/helpers/tabBar";
import UserProfile from "@/components/user/userProfile";
import ProfileActions from "@/components/user/profileActions";
import UserRatings from "@/components/user/userRatings";
import UserReviews from "@/components/user/userReviews";
import { API } from "@/utils/api";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";

export type ProfileTabValue =
	| "profile"
	| "ratings"
	| "reviews"
	| "games"
	| "favorites"
	| "clearList"
	| "admin";

export default function Profile(): AnyElem {
	const [activeTab, setActiveTab] = useState<ProfileTabValue>("profile");
	const [user, setUser] = useState<UserExt>();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	const tabs = [
		{ label: "User Profile", value: "profile" },
		{ label: "Ratings", value: "ratings" },
		{ label: "Reviews", value: "reviews" },
		{ label: "Games", value: "games" },
		{ label: "Favorites List", value: "favorites" },
		{ label: "Clear List", value: "clearList" },
		{ label: "Admin", value: "admin" },
	] as const;

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		// Anti-trolling measures
		if (isNaN(id) || id < 0 || !id) {
			setError(true);
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await API.users().getUserCompositeAll(id);
				const user = resp.data;
				const newData: UserExt = {
					id: user.id,
					name: user.name,
					dateCreated: user.dateCreated
						? formatDate(new Date(user.dateCreated))
						: null,
					twitchLink: user.twitchLink,
					youtubeLink: user.youtubeLink,
					twitterLink: user.twitterLink,
					bio: user.bio,
					token: user.token,
					reviewCount: user.reviewCount,
					ratingsCount: user.ratingsCount,
					screenshotCount: user.screenshotCount,
				};
				setUser(newData);
			} catch (err: any) {
				if (err.response?.status === 404) {
					setError(true);
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [router, router.isReady, router.query.id]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">Invalid Page</span>;

		return (
			<>
				<h2>{`${user.name}'s Profile`}</h2>
				<ProfileActions user={user} />
				<div className="border border-solid border-gray-400 rounded-md bg-white text-[1.1em] font-verdana">
					<div className="border border-gray-400 rounded-md p-[0.25em]">
						{/* Tabs */}
						<TabBar<ProfileTabValue>
							tabs={tabs}
							activeTab={activeTab}
							onTabChange={setActiveTab}
						/>

						{/* Profile */}
						{activeTab === "profile" && user && <UserProfile user={user} />}

						{/* Ratings */}
						{activeTab === "ratings" && user && <UserRatings user={user} />}

						{/* Reviews */}
						{activeTab === "reviews" && user && <UserReviews user={user} />}

						{/* Admin */}
						{activeTab === "admin" && user && (
							<>
								<input type="checkbox" /> Can submit new games <br />
								<input type="checkbox" /> Can report <br />
								<input type="checkbox" /> Can submit screenshots <br />
								<input type="checkbox" /> Can submit reviews <br />
								<input type="checkbox" /> Can send Private Messages <br />
							</>
						)}
					</div>
				</div>
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">{renderContent()}</div>
				<Footer />
			</div>
		</div>
	);
}

