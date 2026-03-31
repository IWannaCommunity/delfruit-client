import type { UserRegistration } from "delfruit-swagger-cg-sdk";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { type FormEvent, useState } from "react";
import Captcha from "@/components/captcha";
import Header from "@/components/header";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";

export default function Register(): AnyElem {
	const [error, setError] = useState<string | null>(null);
	const [captchaToken, setCaptchaToken] = useState<string>("");
	const router = useRouter();

	async function attemptUserRegistration(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData: FormData = new FormData(evt.currentTarget);

		// TODO: check if we actually registered
		try {
			const proof = frmData.get("cf-turnstile-response");
			frmData.delete("cf-turnstile-response");
			frmData.delete("pass_confirm");
			const resp = await API.users().postUser(
				Object.fromEntries(frmData) as any as UserRegistration,
				proof,
			);
			await router.push("/register/finalize");
		} catch (err) {
			setError("Something went wrong");
		}
	}
	return (
		<>
			<Head>
				<title>Register - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Register an Account</h2>
					<p>
						Registering an account on Delicious-Fruit is quick and easy! Here's
						just a couple of perks you get as a member:
					</p>
					<ul>
						<li>Ability to leave reviews on fangames</li>
						<li>Keep a list of your favorite fangames to share with others</li>
					</ul>
					<p>
						There's just a couple of simple rules we ask you to follow in order
						to keep this site orderly:
					</p>
					<ol>
						<li>
							<span className="font-bold mr-1">Write Honest Reviews</span>-
							Please do not intentionally give games a rating that would be
							considered sarcastic or a troll. (You are allowed to be funny with
							your comments.)
						</li>
						<li>
							<span className="font-bold mr-1">Don't Attack Other Reviews</span>
							- We do not take lightly to bashing other people's opinions. If
							your comment attacks others, it will be taken down.
						</li>
						<li>
							<span className="font-bold mr-1">Be Respectful</span>- You may not
							like a game, but do not bash the creator directly. State what you
							did/did not like about the game, and leave it at that.
						</li>
						<li>Do not impersonate another user of the community.</li>
						<li>
							If your permissions have been revoked, contact an administrator.
							Do not create a new account.
						</li>
						<li>
							If you are found creating multiple accounts without permission
							your old and new account will be suspended indefinitely.
						</li>
						<li>Please do not use a throwaway email account.</li>
						<li>
							We don't reset passwords for accounts that don't have a linked
							email or use a throwaway email.
						</li>
					</ol>
					<form
						className="pure-form pure-form-aligned"
						onSubmit={attemptUserRegistration}
					>
						<fieldset>
							<div className="pure-control-group">
								<label htmlFor="user">Username</label>
								<input
									className="pure-input-1-3"
									id="user"
									type="text"
									required
									pattern={"[A-Za-z0-9_]{3,50}"}
									placeholder=""
									name="username"
								/>
							</div>
							<p>
								ASCII only for username please; don't worry, we accept unicode
								elsewhere throughout the site!
							</p>

							<div className="pure-control-group">
								<label htmlFor="pass">Password</label>
								<input
									className="pure-input-1-3"
									id="pass"
									type="password"
									required
									pattern=".{4,}"
									placeholder=""
									name="password"
								/>
							</div>

							<div className="pure-control-group">
								<label htmlFor="pass_confirm">Confirm Password</label>
								<input
									className="pure-input-1-3"
									id="pass_confirm"
									type="password"
									required
									placeholder=""
									name="pass_confirm"
								/>
							</div>

							<div className="pure-control-group">
								<label htmlFor="email">Email (optional)</label>
								<input
									className="pure-input-1-3"
									id="email"
									type="email"
									placeholder=""
									name="email"
									autoComplete="on"
								/>
							</div>
							<p>
								<span className="font-bold mr-1">
									Why do you need my email?
								</span>
								We only keep your email so we can send you a password reset link
								if you ever forget!
							</p>

							{/*<input
								type="hidden"
								id="securityquestion"
								name="securityquestion"
								defaultValue="1"
							/>*/}

							<Captcha onSuccess={setCaptchaToken} />

							<div className="pure-control-group">
								<button
									type="submit"
									className="pure-button pure-button-primary"
								>
									Submit
								</button>
								{error && <span className="text-red-600 ml-1">{error}</span>}
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</>
	);
}
