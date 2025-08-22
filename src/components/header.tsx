import Image from "next/image";
import type { AnyElem } from "../utils/element";
import { useSessionContext } from "../utils/session";
import Whitespace from "./whitespace";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Header(): JSX.Element {
	const [session, setSession] = useSessionContext();
	const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    router.push({
      pathname: "/search",
      query: search ? { s: search } : {}
    });
  };

	return (
		<div id="header">
			<div className="!float-left">
				<a className="!no-underline" href="/">
					<h1>
						<Image src="/images/cherry.gif" alt="Delicious Fruit" width={21} height={24} />
						<Whitespace />
						Delicious Fruit
					</h1>
				</a>
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
				<button type="submit" className="styled-button-1 !ml-[0.35em]" onClick={handleSearch}>
					Search
				</button>
				<a className="styled-button-1 !inline-block !h-[12px] !ml-[0.35em]" href="/">
					Advanced...
				</a>
				{!session.active && (
					<p className="!mt-[1em]">
						<a href="/login">Login</a>
						<Whitespace />
						<a href="/">Register</a>
					</p>
				)}
			</div>
			<div className="!clear-both">
				<a className="navbutton2" href="/">
					Fangames
				</a>
				<Whitespace />
				<a className="navbutton2" href="/">
					Forums
				</a>
				<Whitespace />
				<a className="navbutton2" href="https://www.iwannawiki.com">
					Wiki
				</a>
				<Whitespace />
				<a className="navbutton2" href="https://www.twitch.tv/team/thewannabes">
					Twitch Team
				</a>
				<Whitespace />
				<a className="navbutton2" href="/">
					Bingo
				</a>
				<Whitespace />
				<a className="navbutton2" href="https://www.fangam.es/intro">
					Intro
				</a>
				<Whitespace />
				<form className="!float-right">
					<select id="language" name="locale">
						<option value="en_US" defaultValue>
							English
						</option>
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
					<Whitespace />
					<input type="submit" value="Submit" />
				</form>
			</div>
		</div>
	);
}
