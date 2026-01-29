import Link from "next/link";
import type { AnyElem } from "@/utils/element";

export default function Footer(): AnyElem {
    return (
        <div id="footer">
            <p>
                <span>
                    Delicious-Fruit - Site Design © Klazen 2015-2019, IWC Labs 2020-2025{" "}
                </span>
                <Link href="/contactus">Contact Us</Link> |{" "}
                <Link href="/guidelines">Guidelines</Link>
                <br />
                <Link href="/thanks">Staff &amp; Notable Mentions</Link>
                <br />
                Powered By <Link href="/">Next.js</Link>
            </p>
        </div>
    );
}
