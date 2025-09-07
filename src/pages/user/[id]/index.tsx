import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TabBar from "@/components/helpers/tabBar";
import Profile from "@/components/user/profile";
import ProfileActions from "@/components/user/profileActions";
import Ratings from "@/components/user/ratings";
import UserReviews from "@/components/user/userReviews";
import { UsersApi } from "delfruit-swagger-cg-sdk";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT = new UsersApi(undefined, CFG.apiURL.toString());

export type UserTabValue =
  | "profile"
  | "ratings"
  | "reviews"
  | "games"
  | "favorites"
  | "clearList";

export default function User(): AnyElem {
	const [activeTab, setActiveTab] = useState<UserTabValue>("profile");
	const [user, setUser] = useState<UserExt>();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [session] = useSessionContext();

	const router = useRouter();
	
	const tabs = [
    { label: "User Profile", value: "profile" },
    { label: "Ratings", value: "ratings" },
		{ label: "Reviews", value: "reviews" },
		{ label: "Games", value: "games" },
		{ label: "Favorites List", value: "favorites" },
		{ label: "Clear List", value: "clearList" },
  ] as const;
	
	useEffect(() => {
		if (!router.isReady) return;

		const id = Number(router.query.id);
		
		// Anti-trolling measures
		if (isNaN(id) || id < 0) {
			setError(true);
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const resp = await USERS_API_CLIENT.getUserCompositeAll(id);
				const user = resp.data;
				const newData: UserExt = {
					id: user.id,
					name: user.name,
					dateCreated: user.dateCreated ? formatDate(new Date(user.dateCreated)) : null,
					twitchLink: user.twitchLink,
					youtubeLink: user.youtubeLink,
					twitterLink: user.twitterLink,
					bio: user.bio,
					token: user.token,
					reviewCount: user.reviewCount,
					ratingsCount: user.ratingsCount,
					screenshotCount: user.screenshotCount
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
						<TabBar<UserTabValue> tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
					
						{/* Profile */}
						{activeTab === "profile" && user && <Profile user={user}/>}
						
						{/* Ratings */}
						{/* activeTab === "ratings" && user && <Ratings/> */}
						
						{/* Reviews */}
						{activeTab === "reviews" && user && <UserReviews/>}
					</div>
				</div>
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