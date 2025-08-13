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
					<a href="/" style={{ textDecoration: "none" }}>
						<h1>
							<Image src="/images/cherry.gif" width={21} height={24} />
							Delicious Fruit
						</h1>
					</a>
					<br />
				</div>
				<div className="text-right">
					<form>
						<>Find a fangame:</>
						<input
							type="text"
							id="txt_search"
							name="s"
							placeholder="name or developer"
							size={15}
						/>
						<input className="styled-button-1" type="submit" value="Search" />
						<a className="styled-button-1 !inline-block !h-[12px]">
							Advanced...
						</a>
					</form>

					{!session.active && (
						<p>
							<a>Login</a>
							<a>Register</a>
						</p>
					)}

					<div className="!clear-both !text-left">
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
							<select id="language"></select>
							<input type="submit" value="Submit" />
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
