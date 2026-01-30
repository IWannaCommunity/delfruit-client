import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TabBar from "@/components/helpers/tabBar";
import ProfileMain from "@/components/profile/profileMain";
import ProfileActions from "@/components/profile/profileActions";
import ProfileRatings from "@/components/profile/profileRatings";
import ProfileReviews from "@/components/profile/profileReviews";
import ProfileAdminActions from "@/components/profile/profileAdminActions";
import { API } from "@/utils/api";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";

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
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [session] = useSessionContext();

	const router = useRouter();

	const baseTabs = [
  { label: "User Profile", value: "profile" },
  { label: "Ratings", value: "ratings" },
  { label: "Reviews", value: "reviews" },
  { label: "Games", value: "games" },
  { label: "Favorites List", value: "favorites" },
  { label: "Clear List", value: "clearList" },
] as const;

const tabs = session.admin
  ? [
      ...baseTabs,
      { label: "Admin", value: "admin" },
    ] as const
  : baseTabs;

	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);

		// Anti-trolling measures
		if (isNaN(id) || id < 0 || !id) {
			setError("Invalid page");
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const token = session?.token ? `Bearer ${session.token}` : undefined;
				const resp = await API.users().getUserCompositeAll(id, token);
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
					isFollowing: user.isFollowing
				};
				setUser(newData);
			} catch (err: any) {
				if (err.response?.status === 404) {
					setError("Invalid page");
				} else {
					setError("Something went wrong");
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [router, router.isReady, router.query.id, session.token]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) return <span className="text-red-600">{error}</span>;

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
						{activeTab === "profile" && user && <ProfileMain user={user} />}

						{/* Ratings */}
						{activeTab === "ratings" && user && <ProfileRatings user={user} />}

						{/* Reviews */}
						{activeTab === "reviews" && user && <ProfileReviews user={user} />}

						{/* Admin */}
						{activeTab === "admin" && session.admin && user && <ProfileAdminActions user={user} />}
					</div>
				</div>
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>{`${user?.name}'s profile - Delicious Fruit`}</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">{renderContent()}</div>
				<Footer />
			</div>
		</div>
	);
}

