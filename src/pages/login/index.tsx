import Head from "next/head";
import type { AnyElem } from "../../utils/element";
import Header from "../../components/header";
import Whitespace from "../../components/whitespace";
import { useSessionContext } from "../../utils/session";
import { AuthenticationApi } from "../../generated/swagger-codegen";
import { FormEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const apiClient = new AuthenticationApi(void 0, "http://localhost:4201");

export default function Login(): AnyElem {
	const [session, setSession] = useSessionContext();
	const router = useRouter();

	async function attemptLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData = new FormData(evt.currentTarget);

		// TODO: check if we've actually logged in
		const resp = await apiClient.postLogin({ username: "", password: "" });
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
							<a href="/">Forgot Password?</a>
						</div>
						<div>
							Don't have an account? It only takes 10 seconds to register, and
							then you can get started using Delicious-Fruit!
							<Whitespace />
							<a href="/">Register Now!</a>
						</div>
					</div>
				</div>
			</body>
		</>
	);
}
