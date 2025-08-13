import { ReactNode, ReactPortal, ReactElement } from "react";

export type AnyElem =
	| Iterable<AnyElem>
	| JSX.Element
	| React.FC
	| ReactNode
	| ReactNode[]
	| ReactPortal
	| ReactElement
	| null;
