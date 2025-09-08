import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EditProfile from "@/components/user/editProfile";
import { useSessionContext } from "@/utils/hooks";

export default function ProfileEdit(): AnyElem {
	const [session] = useSessionContext();

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{session.active ? (<EditProfile />)
					: (
						<span>You must login to view this page</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}