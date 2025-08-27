import Head from "next/head";
import Header from "@/components/header";
import { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TabBar from "@/components/tabBar";
import Profile from "@/components/user/profile";
import Ratings from "@/components/user/ratings";
import { UsersApi } from "delfruit-swagger-cg-sdk";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT = new UsersApi(undefined, CFG.apiURL.toString());

export default function User(): NextPage {
	const [activeTab, setActiveTab] = useState<"profile" | "ratings" | "reviews" | "games" | "favorites" | "clearList">("profile");
	const [name, setName] = useState("");
	
	const tabs = [
    { label: "User Profile", value: "profile" },
    { label: "Ratings", value: "ratings" },
		{ label: "Reviews", value: "reviews" },
		{ label: "Games", value: "games" },
		{ label: "Favorites List", value: "favorites" },
		{ label: "Clear List", value: "clearList" },
  ];
	
	const router = useRouter();
	const { id } = router.query;
	
	useEffect(() => {
		if (!id) { return; }

		(async () => {
			const resp = await USERS_API_CLIENT.getUser(id);
			const user_name = resp.data.name;
			setName(user_name);
		})();
	}, [id]);
	
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>{name}'s Profile</h2>
					<Link href="/">Send a PM</Link>
					<br/>
					<input type="checkbox" id="a_follow"/>
					<span> Follow this user! </span>
					<span className="follow_alert display-none"/>
					<br/>
					
					<div className="border border-solid border-gray-400 rounded-md bg-white text-[1.1em] font-verdana">
						<div className="border border-gray-400 rounded-md p-[0.25em]">
						
							{/* Tabs */}
							<TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
							
							{/* Profile */}
							{activeTab === "profile" && <Profile />}
							
							{/* Ratings */}
							{activeTab === "ratings" && id && <Ratings userID={id}/>}
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

