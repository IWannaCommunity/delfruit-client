// Okay so the news component on the home page and the news components
// on the news pages are somewhat different and I'm not sure whether
// to make them separate or not. Seems like a waste to separate them
// but I'm just leaving this here as a placeholder for now

import BBCode from "@bbob/react/lib";
import type { News } from "delfruit-swagger-cg-sdk";
import Link from "next/link";
import { useMemo, useState } from "react";
import { API } from "@/utils/api";
import { preset } from "@/utils/bbobPreset";
import type { AnyElem } from "@/utils/element";
import { formatDate } from "@/utils/formatDate";

export default function HomeNews(): AnyElem {
	const [latestNews, setLatestNews] = useState<News | null>(null);
	const [posterName, setPosterName] = useState<string>("User");

	useMemo(async () => {
		const newsEntry = (await API.news().getAllNews(0, 1)).data[0];
		const user = await API.users().getUser(newsEntry.posterId);
		setLatestNews(newsEntry);
		return setPosterName(user.data.name);
	}, []);

	return (
		<div className="!relative !p-[0.5em] !bg-[#e8e8e8]">
			<h2>DelFruit News</h2>
			<h3>{latestNews?.title ?? "Retrieving the latest news entry"}</h3>
			<p>
				<BBCode
					plugins={[preset()]}
					options={{
						onlyAllowTags: [
							"b",
							"i",
							"u",
							"s",
							"url",
							"quote",
							"code",
							"list",
							"*",
							"spoiler",
						],
					}}
				>
					{latestNews?.["short"] ?? "..."}
				</BBCode>
			</p>
			<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
				-{posterName} on{" "}
				{formatDate(new Date(latestNews?.dateCreated)) ?? "Never"}
			</div>
			<Link href="/news">Read More...</Link>
		</div>
	);
}
