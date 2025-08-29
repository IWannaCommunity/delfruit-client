import Head from "next/head";
import Header from "@/components/header";
import Whitespace from "@/components/whitespace";
import { useSessionContext } from "@/utils/hooks";
import { AuthenticationApi, UserCredentials } from "delfruit-swagger-cg-sdk";
import { FormEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Config } from "@/utils/config";
import Link from "next/link";
import { NextPage } from "next";

const CFG: Config = require("@/config.json");

const AUTHAPI = new AuthenticationApi(void 0, CFG.apiURL.toString());

export default function Login(): NextPage {
	const [session, setSession] = useSessionContext();
	const router = useRouter();

	async function attemptLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData = new FormData(evt.currentTarget);
		// TODO: check if we've actually logged in
		const resp = await AUTHAPI.postLogin(
			Object.fromEntries(frmData) as any as UserCredentials,
		);
		Cookies.set("session", resp.data.token);
		router.reload();
	}

	return (
		<>
			<Head>
				<title>Login - Delicious Fruit</title>
			</Head>
			<body>
				<div id="container">
					<Header />
					<div id="content">
						<div>
							<form onSubmit={attemptLogin}>
								<p>
									<label htmlFor="username">Username:</label>
									<input id="username" type="text" name="username" />
								</p>
								<p>
									<label htmlFor="password">Password:</label>
									<input id="password" type="password" name="password" />
								</p>
								<p>
									<label>
										<input type="checkbox" name="rememberme" />
										Remember Me
									</label>
								</p>
								<input id="form" type="hidden" name="form" value="1" />
								<button type="submit">Login</button>
							</form>
							<Link href="/">Forgot Password?</Link>
						</div>
						<div>
							Don't have an account? It only takes 10 seconds to register, and
							then you can get started using Delicious-Fruit!
							<Whitespace />
							<Link href="/register">Register Now!</Link>
						</div>
					</div>
				</div>
			</body>
		</>
	);
}
