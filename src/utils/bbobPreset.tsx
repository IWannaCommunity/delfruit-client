/*
* SOURCE: https://codesandbox.io/p/sandbox/great-rhodes-rrkn0?file=%2Fsrc%2FApp.js%3A9%2C1
*/

import reactPreset from "@bbob/preset-react/lib";
import { useState, useRef } from "react";

function Spoiler({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const spoilerRef = useRef<HTMLSpanElement | null>(null);

	function handleReveal() {
		setOpen(true);

		requestAnimationFrame(() => {
			const spoilerEl = spoilerRef.current;
			if (!spoilerEl) return;

			const reviewText = spoilerEl.closest(".review-text") as HTMLElement | null;
			if (!reviewText) return;

			if (reviewText.classList.contains("review-text2")) {
				reviewText.style.height = `${reviewText.offsetHeight}px`;
				reviewText.style.maxHeight = "9999px";

				requestAnimationFrame(() => {
					reviewText.style.height = `${reviewText.scrollHeight}px`;
				});
			}
		});
	}

	return (
		<>
			<span
				className="reveal"
				onClick={handleReveal}
				style={{
					display: open ? "none" : "inline",
					opacity: open ? 0 : 1,
					transition: "opacity 0.6s ease",
				}}
			>
				Reveal Spoiler
			</span>
			<span
				ref={spoilerRef}
				className="spoiler"
				style={{
					display: "inline",
					visibility: open ? "visible" : "hidden",
					opacity: open ? 1 : 0,
					transition: "opacity 2.5s ease",
				}}
			>
				{children}
			</span>
		</>
	);
}

export const preset = reactPreset.extend((tags: any) => ({
	...tags,
	spoiler: (node: { content: any; }) => ({
		tag: Spoiler,
		content: node.content
	})
}));