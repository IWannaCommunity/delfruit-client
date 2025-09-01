import Link from "next/link";

export type UserProps = {
	id: number,
	name: string,
	dateCreated: string | null,
	twitchLink: string,
	youtubeLink: string,
	twitterLink: string,
	bio: string,
	isAdmin: boolean
};

export default function Profile(): JSX.Element {

	return(
		<div className="px-[1.5em] text-black">
			<p>Joined on Aug 26, 2025</p>
			<p> 
				<span> I've submitted:</span>
				<br/>
				<span> 10 Ratings!</span>
				<br/>
				<span> 10 Reviews!</span>
				<br/>
				<span> 10 Screenshots!</span>
			</p>
			<Link href="/">Report this user</Link>
		</div>
	);
}