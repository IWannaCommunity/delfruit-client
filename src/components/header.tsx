import Image from "next/image";
import type { AnyElem } from "../utils/element";
import { useSessionContext } from "../utils/session";
import Whitespace from "./whitespace";

export default function Header(): JSX.Element {
	const [session, setSession] = useSessionContext();

	return (
		<div id="container">
			<div id="header">
				<div className="!float-left">
					<a className="!no-underline" href="/">
						<h1>
							<Image src="/images/cherry.gif" width={21} height={24} />
							<Whitespace />
							Delicious Fruit
						</h1>
					</a>
					<br />
				</div>
				<div className="!text-right">
					<form>
						<> Find a fangame: </>
						<input
							type="text"
							id="txt_search"
							name="s"
							placeholder="name or developer"
							size="15"
						/>
						<Whitespace />
						<input className="styled-button-1" type="submit" value="Search" />
						<Whitespace />
						<a className="styled-button-1 !inline-block !h-[12px]" href="/">
							Advanced...
						</a>
					</form>
					{!session.active && (
						<p className="!mt-[1em]">
							<a href="/">Login</a>
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
						<a
							className="navbutton2"
							href="https://www.twitch.tv/team/thewannabes"
						>
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
								<option value="en_US" selected>English</option>
								<option value="cs_CZ">Čeština</option>
								<option value="de_DE">Deutsch</option>
								<option value="fr_FR">Français</option>
								<option value="ja_JP">日本語</option>
								<option value="ko_KR">한국어</option>
								<option value="nl_NL">Nederlands</option>
								<option value="pt_BR">Português</option>
								<option value="ru_RU">Русский</option>
								<option value="zh_CN">中文</option>
							</select>
							<Whitespace />
							<input type="submit" value="Submit" />
						</form>
					</div>
			</div>
		</div>
	);
}
