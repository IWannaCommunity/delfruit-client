import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionContextProvider } from "@/utils/hooks";
import { ThemeProvider } from "@/utils/themeContext";

export default function MyApp({
	Component,
	pageProps: { ...pageProps },
}: AppProps) {
	return (
		<ThemeProvider>
			<SessionContextProvider>
				<Component {...pageProps} />
			</SessionContextProvider>
		</ThemeProvider>
	);
}
