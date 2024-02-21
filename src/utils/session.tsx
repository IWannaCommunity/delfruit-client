import Cookies from "js-cookie";
import { SetStateAction } from "react";
import { Dispatch } from "react";
import { useEffect } from "react";
import { useState } from "react";
import jwt from "jsonwebtoken";

export interface Session {
    username: string;
    admin: boolean;
    token: string;
}

export function useSession(): [Session, Dispatch<SetStateAction<Session | undefined>>] {
    const [session, setSession] = useState<Session>(null);
    useEffect(() => {
        const sessionCookie = Cookies.get("session");
        if (sessionCookie === undefined) {
            return;
        }

        const sessionToken = jwt.decode(sessionCookie);
        const username = sessionToken["username"];
        const admin = sessionToken["admin"];

        setSession({ username, admin, token: sessionCookie });

        return;
    }, []);
    return [session, setSession]
}
