import Head from "next/head";
import Header from "@/components/header";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { UserCredentials } from "delfruit-swagger-cg-sdk";
import { FormEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnyElem } from "@/utils/element";
import Footer from "@/components/footer";

export default function Login(): AnyElem {
	const [session, setSession] = useSessionContext();
	const router = useRouter();
	const [successfulLogin, setSuccessfulLogin] = useState<boolean>(false);
	const [idempotency, setIdempotency] = useState<boolean>(false);

	useEffect(() => {
		if (Cookies.get("loggedInSuccessfully") !== undefined) {
			setSuccessfulLogin(true);
			Cookies.remove("loggedInSuccessfully");
			setTimeout(() => {
				router.push("/");
			}, 5000);
		}
		setIdempotency(true);
	}, [router]);

	async function attemptLogin(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData = new FormData(evt.currentTarget);
		//frmData.set("notARobot", 386);
		// TODO: check if we've actually logged in
		const resp = await API.authentication().postLogin(
			Object.fromEntries(frmData) as any as UserCredentials,
		);
		Cookies.set("session", resp.data.token);
		Cookies.set("loggedInSuccessfully", "1", {
			expires: new Date(Date.now() + 5000),
		});
		router.reload();
	}

	return (
		<div>
			<Head>
				<title>Login - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{idempotency && !session.active ? (
						<>
							<div>
								<form onSubmit={attemptLogin}>
									<p>
										<label htmlFor="username">Username: </label>
										<input id="username" type="text" name="username" />
									</p>
									<p>
										<label htmlFor="password">Password: </label>
										<input id="password" type="password" name="password" />
									</p>
									{/*
									<p>
										<label>
											<input type="checkbox" name="rememberme" />
											<span> Remember Me</span>
										</label>
									</p>
									<input
										id="form"
										type="number"
										name="notARobot"
										defaultValue={1}
										hidden
									/>
									*/}
									<button type="submit">Login</button>
								</form>
								<br/>
								<Link href="/">Forgot Password?</Link>
							</div>
							<div>
								Don't have an account? It only takes 10 seconds to register,
								and then you can get started using Delicious-Fruit!
								<Link className="ml-1" href="/register">Register Now!</Link>
							</div>
						</>
					) : successfulLogin ? (
						<p>You have been logged in, redirecting...</p>
					) : (
						<p>You are already logged in.</p>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
