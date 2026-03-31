import Head from "next/head";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";

export default function PasswordReset(): AnyElem {
	const [error, setError] = useState<string | undefined>(void 0);
	const router = useRouter();

	const email = (router.query.email as string) ?? "";
	const token = (router.query.token as string) ?? "";

	async function finalizePasswordReset(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData: FormData = new FormData(evt.currentTarget);
		const pwd = frmData.get("password");
		const pwdCfrm = frmData.get("password_confirm");

		if (pwd !== pwdCfrm) {
			return setError("Password inputs do not match.");
		}

		try {
			await API.authentication().postFinalizePassReset({
				email,
				token,
				password: pwd.toString(),
			});
		} catch (e) {
			console.error(e);
			return setError("Provided token was invalid.");
		}

		await router.push("/login");
	}

	return (
		<>
			<Head>Password Reset - Delicious Fruit</Head>
			<div id="container">
				<Header />
				<div id="content">
					<form
						className="pure-form pure-form-aligned"
						onSubmit={finalizePasswordReset}
					>
						<fieldset>
							<div className="pure-control-group">
								<label for="password">Password</label>
								<input
									className="pure-input-1-3"
									id="password"
									type="password"
									required
									pattern=".{4,}"
									name="password"
								/>
							</div>

							<div className="pure-control-group">
								<label for="password">Confirm Password</label>
								<input
									className="pure-input-1-3"
									id="password_confirm"
									type="password"
									required
									placeholder=""
									name="password_confirm"
								/>
							</div>

							<div class="pure-control-group">
								<button
									type="submit"
									className="pure-button pure-button-primary"
								>
									Submit
								</button>
							</div>
						</fieldset>
					</form>
					{error && <span className="text-red-600 ml-1">{error}</span>}
				</div>
				<Footer />
			</div>
		</>
	);
}
