import Link from "next/link";
import type { AnyElem } from "@/utils/element";

export default function Footer(): AnyElem {
	return (
		<div id="footer">
			<p>
				<span>
					Delicious-Fruit - Site Design © Klazen 2015-2019, IWC Labs 2020-2026{" "}
				</span>
				<Link href="/contactus">Contact Us</Link> |{" "}
				<Link href="/guidelines">Guidelines</Link>
				<br />
				<Link href="/thanks">Staff &amp; Notable Mentions</Link>
				<br />
				Powered By <a href="https://expressjs.com">Express</a> &{" "}
				<a href="https://react.dev">React</a> +{" "}
				<a href="https://nextjs.org">Next.js</a>
			</p>
		</div>
	);
}
