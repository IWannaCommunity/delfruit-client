import Head from "next/head";
import Header from "@/components/header";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import TabBar from "@/components/tabBar";
import Profile from "@/components/user/profile";

export default function Home(): NextPage {
	const [activeTab, setActiveTab] = useState<"profile" | "ratings" | "reviews" | "games" | "favorites" | "clearList">("profile");
	
	const tabs = [
    { label: "User Profile", value: "profile" },
    { label: "Ratings", value: "ratings" },
		{ label: "Reviews", value: "reviews" },
		{ label: "Games", value: "games" },
		{ label: "Favorites List", value: "favorites" },
		{ label: "Clear List", value: "clearList" },
  ];
	
	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>User's Profile</h2>
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
							
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

