import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { isNull } from "util";
import { UsersApi } from "../../generated/swagger-codegen";

const apiClient = new UsersApi(void 0, "http://localhost:4201");

export default function Profile() {
	const [user, setUser] = useState(null);
	const [tab, setTab] = useState(0);

	const router = useRouter();
	const params = router.query;

	useEffect(() => {
		const fetchUser = async () => {
			console.log(params);
			const req = await apiClient.getUser(Number.parseInt(params["id"], 10));
			console.log(req);
			if (req.status !== 200) {
				return;
			}
			setUser(req.data);
		};

		fetchUser();
	}, []);

	const dateFormattingOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	const extractDateJoinedFromUser = (u: any): string => {
		if (isNull(u)) {
			return "Jan 01, 1970";
		}
		return new Date(u.dateCreated).toLocaleDateString(
			"en-US",
			dateFormattingOptions,
		);
	};

	const extractBioFromUser = (u: any): JSX.Element => {
		if (isNull(u) || u.bio === null || u.bio === "") {
			return <p className="italic">There is nothing written here.</p>;
		}

		return <p>{u.bio}</p>;
	};

	const tabContents = (): JSX.Element => {
		switch (tab) {
			case 0:
				return (
					<>
						<a className="flex">Joined on: {extractDateJoinedFromUser(user)}</a>
						<a className="flex">
							Bio:
							{extractBioFromUser(user)}
						</a>
					</>
				);
			case 1:
				return <></>;
		}
	};

	return (
		<>
			<Head>
				<title>Delfruit 2</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			<div className="relative">{tabContents()}</div>
			<Footer />
		</>
	);
}
