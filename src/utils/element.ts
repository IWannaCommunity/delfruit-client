import { ReactNode, ReactPortal, ReactElement } from "react";

// TODO: find a way to make number, and boolean compatible
export type AnyElem = Exclude<
	| Exclude<ReactElement<any, any>, string | number | boolean>
	| ReactPortal
	| Exclude<ReactNode, string | number | boolean>
	| JSX.Element
	| string
	| null,
	Iterable<ReactNode>
>;
