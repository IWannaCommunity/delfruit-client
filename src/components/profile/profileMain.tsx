import Link from "next/link";
import Image from "next/image";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";

type UserInfoProps = {
	user: UserExt;
};

export default function ProfileMain({ user }: UserInfoProps): JSX.Element {
	const [session] = useSessionContext();

	return(
		<div className="px-[1.5em] text-black">
			<p>Joined on {user.dateCreated}</p>
			{user.bio && (
				<>
					<p className="mb-2">Bio:</p>
					<p className="break-words whitespace-pre-wrap">{user.bio}</p>
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
					<Image src="/images/twitch16.png" alt="" width={16} height={16}/>
					<a className="ml-2" href={user.twitchLink}>Twitch Stream</a>
					<br/>
				</>
			)}
			{user.youtubeLink && (
				<>
					<Image src="/images/youtube16.png" alt="" width={16} height={16}/>
					<a className="ml-2" href={user.youtubeLink}>Youtube Channel</a>
					<br/>
				</>
			)}
			{user.twitterLink && (
				<>
					<Image src="/images/twitter16.png" alt="" width={16} height={16}/>
					<a className="ml-2" href={user.twitterLink}>Twittter</a>
					<br/>
				</>
			)}

			{session.active && session.user_id !== user.id && (
				<div className="mt-[1em]">
					<Link href={`/report/user/${user.id}`}>Report this user</Link>
				</div>
			)}
		</div>
	);
}