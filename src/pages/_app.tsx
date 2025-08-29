import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionContextProvider } from "@/utils/hooks";

export default function MyApp({
	Component,
	pageProps: { ...pageProps },
}: AppProps) {
	return (
		<SessionContextProvider>
			<Component {...pageProps} />
		</SessionContextProvider>
	);
}
