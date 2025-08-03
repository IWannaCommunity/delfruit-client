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
}
