import type { NextPage } from "next";
import Head from "next/head";
import type React from "react";
import { type FormEvent, useCallback, useState } from "react";
import Captcha from "@/components/captcha";
import Header from "@/components/header";
import { API } from "@/utils/api";

enum ServerResponse {
	None = -1,
	Success = 0,
	Failed = 1,
	Captcha = 2,
}

export default function ForgotPassword(): NextPage {
	const [response, setResponse] = useState<ServerResponse>(ServerResponse.None);

	const noop1 = (_: string): void => {};

	const reqPwdReset = useCallback(
		async (e: React.FormEvent & FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			const frmData: FormData = new FormData(e.currentTarget);
			const captchaProof = frmData.get("cf-turnstile-response").toString();

			try {
				await API.authentication().postResetRequest(
					{
						username: frmData.get("username").toString(),
						email: frmData.get("email").toString(),
					},
					captchaProof,
				);
			} catch (e) {
				return setResponse(ServerResponse.Failed);
			}
			setResponse(ServerResponse.Success);
		},
		[],
	);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{response === ServerResponse.None ? (
						<div>
							<form onSubmit={reqPwdReset}>
								<p>
									<label htmlFor="username">Username: </label>
									<input type="text" id="username" name="username" />
								</p>
								<p>
									<label htmlFor="email">Email :</label>
									<input type="email" id="email" name="email" />
								</p>
								<Captcha onSuccess={noop1} />
								{/* <input type="hidden" id="form" value="1" /> */}
								<input type="submit" value="Send Email" />
							</form>
						</div>
					) : response === ServerResponse.Success ? (
						<p>
							Email sent! Please allow up to 30 minutes for delivery, it can
							take a while. Make sure to check your spam folder!
						</p>
					) : response === ServerResponse.Failed ? (
						<p>Internal Server Error! Please try again later.</p>
					) : (
						<p>
							Username/email/captcha incorrect. Please go back and try again!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
