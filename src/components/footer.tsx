import { AnyElem } from "@/utils/element";
import Link from "next/link";

export default function Footer(): AnyElem {
    return (
        <div id="footer">
            <p>
                Delicious-Fruit - Site Design © Klazen 2015-2019, IWC Labs 2020-2025{" "}
                <Link href="/">Contact Us</Link> | <Link href="/">Guidelines</Link>
                <br />
                <Link href="/">Staff &amp; Notable Mentions</Link>
                <br />
                Powered By <Link href="/">Next.js</Link>
            </p>
        </div>
    );
}
