import Cookies from "js-cookie";
import { ReactNode, SetStateAction, createContext, useContext } from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { Dispatch } from "react";
import jwt from "jsonwebtoken";
import { API } from "@/utils/api";

export interface Session {
	active: boolean;
	username: string;
	user_id: number | null;
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
	}
	const [session, setSession] = useState<Session>({
		active: false,
		username: "Guest",
		user_id: null,
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
		const admin = sessionToken["isAdmin"];
		const userId = Number(sessionToken["sub"]); // If your IDE says this is deprecated, it is literally stupid (thanks vscode)

		API.setToken(sessionCookie)

		setSession({
			active: true,
			username,
			user_id: userId,
			admin,
			token: sessionCookie,
		});

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

/**
 * Hook that only runs when the component mounts.
 * @description This hook only runs with the component mounts. The implementation it
 * self is very simple as it's just a wrapper around useEffect. The entirety of this
 * is mostly a visual and contextual hint that the callback inside should only ever
 * be ran "once", and ran at mount. By ensuring a dependency list cannot be passed
 * it ensure that it will only ever run once. However, this also requires that
 * the effect contained inside does not require any outside depedencies, and that
 * the function it's self is mostly pure. Just because this only runs "once", does
 * not mean it only ever runs "once". If your component has other useEffect hooks,
 * then this hook will re-run, and if it has dependencies, then they WILL be stale.
 * @param {React.EffectCallback} effect - The callback to be ran on mount.
 * @param {React.DependencyList} deps - Dependencies that this hook relies on.
 * @returns {void}
 */
export function useMount(
	effect: React.EffectCallback,
	deps: React.DependencyList,
): void {
	// QUEST: unsure why passing in a callback from a function parameter
	// to be used would count as a dependency, as I assume that would be
	// cyclic, but perhaps I'm wrong?

	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useEffect(effect, [...deps]);
}

/**
 * Hook that only runs when the component is unmounted.
 * @description This hook only runs when the component is unmounted. On the occasion that
 * you only want to run code when the component is unmounted, for something like a
 * destructor, then this hook will be useful to you. However, if you also want to run
 * additional code along side this, you might want to look towards
 *  using useEffectWithUnmount instead.
 * @param {VoidFunction} cleanup - The callback to be ran on unmount.
 * @param {React.DependencyList} deps - Dependencies that this hook relies on.
 * @returns {void}
 */
export function useUnmount(
	cleanup: VoidFunction,
	deps: React.DependencyList,
): void {
	return useEffect(() => {
		return cleanup;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cleanup, ...deps]);
}

/**
 * Hook that only runs when the component is unmounted.
 * @description This hook only runs when the component is unmounted. On the occasion that
 * you only want to run code when the component is unmounted, for something like a
 * destructor, then this hook will be useful to you.
 * @param {React.EffectCallback} effect - The callback to be ran as the base of the effect.
 * @param {VoidFunction} cleanup - The callback to be ran on unmount.
 * @param {React.DependencyList} deps - Dependencies that this hook relies on.
 * @returns {void}
 */
export function useEffectWithUnmount(
	effect: React.EffectCallback,
	cleanup: VoidFunction,
	deps: React.DependencyList,
): void {
	return useEffect(() => {
		effect();

		return cleanup;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [effect, cleanup, ...deps]);
}
