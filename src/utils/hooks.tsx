import Cookies from "js-cookie";
import { ReactNode, SetStateAction, createContext, useContext } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { Dispatch } from "react";
import jwt from "jsonwebtoken";

export interface Session {
	active: boolean;
	username: string;
	admin: boolean;
	token: string;
}

function useSession(): [
	Session,
	Dispatch<SetStateAction<Session | undefined>>,
] {
	try {
		useState(void 0);
	} catch (e) {
		console.log("If you only see this once then it should be ok!");
		console.error(e);
		return;
	}
	const [session, setSession] = useState<Session>({
		active: false,
		username: "Guest",
		admin: false,
		token: "",
	});
	useEffect(() => {
		console.log("session effect running");
		const sessionCookie = Cookies.get("session");
		if (sessionCookie === undefined) {
			return;
		}

		const sessionToken = jwt.decode(sessionCookie);
		const username = sessionToken["username"];
		const admin = sessionToken["admin"];

		setSession({ active: true, username, admin, token: sessionCookie });

		return;
	}, []);
	return [session, setSession];
}

const SessionContext = createContext<
	[Session, React.Dispatch<SetStateAction<Session>>] | undefined
>(void 0);

export function SessionContextProvider(props: {
	children: ReactNode;
}): JSX.Element {
	const [session, setSession] = useSession();

	const SessionContextStore = [session, setSession];
	return (
		<SessionContext.Provider value={SessionContextStore}>
			{props.children}
		</SessionContext.Provider>
	);
}

export function useSessionContext(): [
	Session,
	Dispatch<SetStateAction<Session>>,
] {
	return useContext(SessionContext);
}

export interface UseEffectAsyncResult {
	result: any;
	error: any;
	isLoading: boolean;
}
/**
 * Hook to run an effect asyncronously on mount and another on unmount.
 * Taken from: https://marmelab.com/blog/2023/01/11/use-async-effect-react.html
 * @param {() => Promise<any>} mountCallback - The callback to be ran on mount.
 * @param {() => Promise<any>} unmountCallback - The callback to be ran on unmount.
 * @param {any[]} deps - Dependencies that this effect relies on, causes a re-render if any of these changes.
 * @returns UseEffectAsyncResult
 */
export function useEffectAsync(
	mountCallback: () => Promise<any>,
	unmountCallback: () => Promise<any>,
	deps: any[] = [],
): UseEffectAsyncResult {
	const isMounted = useRef(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<unknown>(undefined);
	const [result, setResult] = useState<any>();

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		let ignore = false;
		let mountSucceeded = false;

		(async () => {
			await Promise.resolve(); // wait for the initial cleanup in Strict mode - avoids double mutation
			if (!isMounted.current || ignore) {
				return;
			}
			setIsLoading(true);
			try {
				const result = await mountCallback();
				mountSucceeded = true;
				if (isMounted.current && !ignore) {
					setError(undefined);
					setResult(result);
					setIsLoading(false);
				} else {
					// Component was unmounted before the mount callback returned, cancel it
					unmountCallback();
				}
			} catch (error) {
				if (!isMounted.current) return;
				setError(error);
				setIsLoading(false);
			}
		})();

		return () => {
			ignore = true;
			if (mountSucceeded) {
				unmountCallback()
					.then(() => {
						if (!isMounted.current) return;
						setResult(undefined);
					})
					.catch((error: unknown) => {
						if (!isMounted.current) return;
						setError(error);
					});
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);

	return useMemo(
		() => ({ result, error, isLoading }),
		[result, error, isLoading],
	);
}
