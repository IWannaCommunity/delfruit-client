/*
* SOURCE: https://codesandbox.io/p/sandbox/great-rhodes-rrkn0?file=%2Fsrc%2FApp.js%3A9%2C1
*/

import reactPreset from "@bbob/preset-react/lib";
import { useState } from "react";

const VALID_BBCODE_TAGS = new Set([
	"b", "/b",
	"i", "/i",
	"u", "/u",
	"s", "/s",
	"url", "/url",
	"quote", "/quote",
	"code", "/code",
	"list", "/list",
	"*",
	"spoiler", "/spoiler",
]);

export function sanitizeBBCode(text: string): string {
	return text.replace(/$$([^[$$]+)\]/g, (full, inner) => {
		const tagName = inner.split("=")[0].trim().toLowerCase();
		return VALID_BBCODE_TAGS.has(tagName) ? full : `［${inner}］`;
	});
}

function Spoiler({ children }) {
	const [open, setOpen] = useState(false);

	return open ? (
		<div>{children}</div>
	) : (
		<span className="reveal" onClick={() => setOpen(true)}>
			Reveal Spoiler
		</span>
	);
}

export const preset = reactPreset.extend((tags: any) => ({
	...tags,
	spoiler: (node: { content: any; }) => ({
		tag: Spoiler,
		content: node.content
	})
}));