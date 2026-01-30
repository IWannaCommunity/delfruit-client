import { AnyElem } from "@/utils/element";
import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProfileEdit from "@/components/profile/profileEdit";
import { useSessionContext } from "@/utils/hooks";

export default function ProfileEditPage(): AnyElem {
	const [session] = useSessionContext();

	return (
		<div>
			<Head>
				<title>Edit Your Profile - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{session.active ? (<ProfileEdit />)
					: (
						<span>You must login to view this page</span>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}