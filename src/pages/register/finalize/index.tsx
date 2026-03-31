import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { API } from "@/utils/api";
import type { AnyElem } from "@/utils/element";

export default function RegisterFinalize(): AnyElem {
	const [error, setError] = useState<string | undefined>(void 0);
	const router = useRouter();

	const key = (router.query.key as string) ?? "";
	const id = (router.query.id as string) ?? "";

	const verifyUser = useCallback(
		async (k, i) => {
			try {
				const resp = await API.authentication().getUserVerify(k, Number(i));

				Cookies.set("session", resp.data.token);
				Cookies.set("loggedInSuccessfully", "1", {
					expires: new Date(Date.now() + 5000),
				});
				API.setToken(resp.data.token);
				await router.push("/");
			} catch (e) {
				console.log(e);
				setError("Account is already verified, or keys are invalid.");
			}
		},
		[router],
	);

	async function finalizeRegistration(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const frmData: FormData = new FormData(evt.currentTarget);

		await verifyUser(frmData.get("key"), frmData.get("id"));
	}

	useEffect(() => {
		if (!router.isReady) return;

		console.log(key);
		console.log(id);
		if (key && id) {
			verifyUser(key, id);
		}
	}, [router, key, id, verifyUser]);

	return (
		<>
			<Head>
				<title>Registration Finalization - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h3>
						Please enter your registration key and ID that you received in your
						email.
					</h3>
					<form onSubmit={finalizeRegistration}>
						<fieldset>
							<div>
								Key: <input type="text" name="key" />
							</div>
							<div>
								ID: <input type="number" name="id" />
							</div>
							<button type="submit">Finish Registration</button>
						</fieldset>
					</form>
					{error && <span className="text-red-600 ml-1">{error}</span>}
				</div>
				<Footer />
			</div>
		</>
	);
}
