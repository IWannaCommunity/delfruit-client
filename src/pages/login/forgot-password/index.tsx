import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Captcha from "@/components/captcha";
import Header from "@/components/header";

enum ServerResponse {
	None = -1,
	Success = 0,
	Failed = 1,
	Captcha = 2,
}

export default function ForgotPassword(): NextPage {
	const [response, setResponse] = useState<ServerResponse>(ServerResponse.None);

	const noop1 = (_: string): void => {};

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
							<form>
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
