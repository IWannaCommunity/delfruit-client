
import type { UserExt } from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import TabBar from "@/components/helpers/tabBar";
import ProfileActions from "@/components/profile/profileActions";
import ProfileAdminActions from "@/components/profile/profileAdminActions";
import ProfileBookmarks from "@/components/profile/profileBookmarks";
import ProfileClears from "@/components/profile/profileClears";
import ProfileFavorites from "@/components/profile/profileFavorites";
import ProfileFollowing from "@/components/profile/profileFollowing";
import ProfileGames from "@/components/profile/profileGames";
import ProfileMain from "@/components/profile/profileMain";
import ProfileRatings from "@/components/profile/profileRatings";
import ProfileReviews from "@/components/profile/profileReviews";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";
import { formatDate } from "@/utils/formatDate";
import { useSessionContext } from "@/utils/hooks";

export type ProfileTabValue =
  | "profile"
  | "ratings"
  | "reviews"
  | "games"
  | "favorites"
  | "clearList"
  | "bookmarks"
  | "following"
  | "admin";

type ProfilePageProps = {
  profileId?: number;
};

export default function ProfilePage({
  profileId,
}: ProfilePageProps): AnyElem {
    const [activeTab, setActiveTab] =
      useState<ProfileTabValue>("profile");
    const [user, setUser] = useState<UserExt>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [session] = useSessionContext();
    const isOwnProfile = profileId === undefined;
    const targetId = isOwnProfile ? session?.user_id : profileId;

    const tabs = [
      { label: "User Profile", value: "profile" },
      { label: "Ratings", value: "ratings" },
      { label: "Reviews", value: "reviews" },
      { label: "Games", value: "games" },
      { label: "Favorites List", value: "favorites" },
      { label: "Clear List", value: "clearList" },
			(isOwnProfile
        ? [
            { label: "Bookmarks", value: "bookmarks" },
            { label: "Following", value: "following" },
          ]
        : []),
      (session.admin
        ? [{ label: "Admin", value: "admin" }]
        : []),
		] satisfies { label: string; value: ProfileTabValue }[];

    useEffect(() => {
      if (!targetId) {
        if (isOwnProfile && !session?.user_id) {
          setLoading(false);
        }
        return;
      }

			let cancelled = false;

			setLoading(true);
			setError(null);
			setUser(undefined);

			(async () => {
				try {
					const token = session?.token
						? `Bearer ${session.token}`
						: undefined;

					const resp = await API.users().getUserCompositeAll(
						targetId,
						token,
					);

					const data = resp.data;

					const newData: UserExt = {
						id: data.id,
						name: data.name,
						dateCreated: data.dateCreated
							? formatDate(new Date(data.dateCreated))
							: null,
						twitchLink: data.twitchLink,
						youtubeLink: data.youtubeLink,
						twitterLink: data.twitterLink,
						bio: data.bio,
						token: data.token,
						reviewCount: data.reviewCount,
						ratingsCount: data.ratingsCount,
						screenshotCount: data.screenshotCount,
						isFollowing: data.isFollowing,
					};

					if (!cancelled) {
						setUser(newData);
					}
				} catch (err: unknown) {
						if (cancelled) return;

						const status = (
							err as { response?: { status?: number } }
						).response?.status;

						setError(
							status === 404
								? "Invalid page"
								: "Something went wrong",
						);
				} finally {
					if (!cancelled) {
						setLoading(false);
					}
				}
		})();

		return () => {
			cancelled = true;
		};

	}, [targetId, session?.token, isOwnProfile]);

	const renderContent = () => {
		if (loading) return <span>Loading...</span>;
		if (error) {
			return <span className="text-red-600">{error}</span>;
		}

		if (!user) return <span>Invalid page</span>;

		return (
			<>
				<h2>{`${user.name}'s Profile`}</h2>
				<ProfileActions user={user} />

				<div className="border border-solid border-gray-400 rounded-md 
					bg-[#363636] text-[1.1em] font-verdana"
				>
					<div className="border border-gray-400 rounded-md p-[0.25em]">
						{/* Tabs */}
						<TabBar<ProfileTabValue>
							tabs={tabs}
							activeTab={activeTab}
							onTabChange={setActiveTab}
						/>
						{/* Profile */}
						<div hidden={activeTab !== "profile"}>
							<ProfileMain user={user} />
						</div>
						{/* Ratings */}
						<div hidden={activeTab !== "ratings"}>
							<ProfileRatings user={user} />
						</div>
						{/* Reviews */}
						<div hidden={activeTab !== "reviews"}>
							<ProfileReviews user={user} />
						</div>
						{/* User Games */}
						<div hidden={activeTab !== "games"}>
							<ProfileGames user={user} />
						</div>
						{/* Favorites */}
						<div hidden={activeTab !== "favorites"}>
							<ProfileFavorites user={user} />
						</div>
						{/* Clears */}
						<div hidden={activeTab !== "clearList"}>
							<ProfileClears user={user} />
						</div>
						{/* Owned Profile (Bookmarks/Following) */}
						{isOwnProfile && (
							<>
								<div hidden={activeTab !== "bookmarks"}>
									<ProfileBookmarks user={user} />
								</div>

								<div hidden={activeTab !== "following"}>
									<ProfileFollowing user={user} />
								</div>
							</>
						)}
						{/* Admin */}
						<div hidden={activeTab !== "admin"}>
							{session.admin && (
								<ProfileAdminActions user={user} />
							)}
						</div>
					</div>
				</div>
			</>
		);
	};

	return (
		<div>
			<Head>
				<title>
					{user?.name
						? `${user.name}'s profile - Delicious Fruit`
						: "Profile - Delicious Fruit"}
				</title>
			</Head>

			<div id="container">
				<Header />
					<div id="content">
						{isOwnProfile && !session.active
							? <span>You must login to view this page</span>
							: renderContent()}
					</div>
				<Footer />
			</div>
		</div>
	);
}
