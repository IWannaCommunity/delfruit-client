import Image from "next/image";
import type { AnyElem } from "@/utils/element";
import { useSessionContext } from "@/utils/hooks";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Header(): AnyElem {
	const [session] = useSessionContext();
	const router = useRouter();
	const [search, setSearch] = useState("");

	const handleSearch = () => {
		router.push({
			pathname: "/search",
			query: search ? { q: search } : {},
		});

		setSearch("");
	};

	return (
		<div id="header">
			<div className="!float-left">
				<Link className="!no-underline" href="/">
					<h1>
						<Image
							src="/images/cherry.gif"
							alt="Delicious Fruit"
							width={21}
							height={24}
						/>
						<span className="ml-2">Delicious Fruit</span>
					</h1>
				</Link>
				<br />
			</div>
			<div className="!text-right">
				<span>Find a fangame: </span>
				<input
					type="text"
					placeholder="name or developer"
					size={15}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
				/>
				<button
					type="submit"
					className="styled-button-1 ml-1"
					onClick={handleSearch}
				>
					Search
				</button>
				<Link
					className="styled-button-1 !inline-block !h-[12px] ml-1"
					href="/search/advanced"
				>
					Advanced...
				</Link>
				<p className="!mt-[1em]">
					{!session.active ? (
						<>
							<Link className="mr-1" href="/login">Login</Link>
							<Link href="/register">Register</Link>
						</>
					) : (
						<>
							<span className="mr-1">{session.username}</span>
							<Link className="mr-1" href="/messages">
								Messages
							</Link>
							<Link className="mr-1" href="/profile">Profile</Link>
							<Link href="/login/logout">Logout</Link>
						</>
					)}
				</p>
			</div>
			<div className="!clear-both">
				<Link className="navbutton2 mr-1" href="/">
					Fangames
				</Link>
				<a className="navbutton2 mr-1" href="https://iwannacommunity.com/forum/">
					Forums
				</a>
				<a className="navbutton2 mr-1" href="https://www.iwannawiki.com">
					Wiki
				</a>
				<a className="navbutton2 mr-1" href="https://www.twitch.tv/team/thewannabes">
					Twitch Team
				</a>
				<Link className="navbutton2 mr-1" href="/">
					Bingo
				</Link>
				<a className="navbutton2" href="https://www.fangam.es/intro">
					Intro
				</a>
				<form className="!float-right">
					<select id="language" name="locale">
						<option defaultValue="en_US">English</option>
						{false && (
							<>
								<option value="cs_CZ">Čeština</option>
								<option value="de_DE">Deutsch</option>
								<option value="fr_FR">Français</option>
								<option value="ja_JP">日本語</option>
								<option value="ko_KR">한국어</option>
								<option value="nl_NL">Nederlands</option>
								<option value="pt_BR">Português</option>
								<option value="ru_RU">Русский</option>
								<option value="zh_CN">中文</option>
							</>
						)}
					</select>
					<input className="ml-1" type="submit" value="Submit" />
				</form>
			</div>
		</div>
	);
}
