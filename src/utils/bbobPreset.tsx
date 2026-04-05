/*
* SOURCE: https://codesandbox.io/p/sandbox/great-rhodes-rrkn0?file=%2Fsrc%2FApp.js%3A9%2C1
*/

import reactPreset from "@bbob/preset-react/lib";
import { useState } from "react";

function Spoiler({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);

	return open ? (
		<span className="spoiler">{children}</span>
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