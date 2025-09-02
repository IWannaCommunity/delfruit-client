import Link from "next/link";
import Image from "next/image";
import { UserExt } from "delfruit-swagger-cg-sdk";

type UserInfoProps = {
	user: UserExt;
};

export default function Profile({ user }: UserInfoProps): JSX.Element {

	return(
		<div className="px-[1.5em] text-black">
			<p>Joined on {user.dateCreated}</p>
			{user.bio && (
				<>
					<p className="mb-2">Bio:</p>
					<p>{user.bio}</p>
				</>
			)}
			<p>
				<span> I've submitted:</span>
				<br/>
				<span> {user.ratingsCount} Ratings!</span>
				<br/>
				<span> {user.reviewCount} Reviews!</span>
				<br/>
				<span> {user.screenshotCount} Screenshots!</span>
			</p>
			{user.twitchLink && (
				<>
					<Image src="images/twitch16.png" alt="" width={16} height={16}/>
					<Link href={user.twitchLink}>Twitch Stream</Link>
					<br/>
				</>
			)}
			{user.youtubeLink && (
				<>
					<Image src="images/youtube16.png" alt="" width={16} height={16}/>
					<Link href={user.youtubeLink}>Youtube Channel</Link>
					<br/>
				</>
			)}
			{user.twitterLink && (
				<>
					<Image src="images/twitter16.png" alt="" width={16} height={16}/>
					<Link href={user.twitterLink}>Twittter</Link>
					<br/>
				</>
			)}
			<Link href="/">Report this user</Link>
		</div>
	);
}