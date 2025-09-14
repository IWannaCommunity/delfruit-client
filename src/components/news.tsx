import { News as NewsT } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useState } from "react";
import BBCode from "@bbob/react/lib";
import { preset } from "@/utils/bbobPreset";

export default function News(props: NewsT): JSX.Element {

	const [expanded, setExpanded] = useState(false);

	const maxLength = 500;
	const shouldTruncate = props.news
		? props.news.length > maxLength
		: false;
	const displayText =
		expanded || !shouldTruncate
			? props.news
			: props.news.slice(0, maxLength) + "...";

	return (
		<div className="!relative !p-[0.5em] !bg-[#e8e8e8]">
			<h3>
				<Link href={`/news/${props.id}`}>
					{props.title}
				</Link>
			</h3>

			{/* CONTENT */}
			{props.news !== "" && props.news !== null && (
				<div>
					<div className="break-words whitespace-pre-wrap">
						<BBCode plugins={[preset()]}>{displayText}</BBCode>
					</div>

					{shouldTruncate && (
						<a
							className="standalone underline cursor-pointer"
							onClick={() => setExpanded(!expanded)}
						>
							{expanded ? "Show less" : "Read more"}
						</a>
					)}
				</div>
			)}

			<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
				-User on {props.date_created}
			</div>	
		</div>
	);
}