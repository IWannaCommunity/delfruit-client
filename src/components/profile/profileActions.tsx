import Link from "next/link";
import { useState } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";

type UserInfoProps = {
	user: UserExt;
};

export default function ProfileActions({ user }: UserInfoProps) {
	const [session] = useSessionContext();
	const [isFollowing, setIsFollowing] = useState(!!user.isFollowing);
	const [alertMsg, setAlertMsg] = useState<string | null>(null);

	const changeFollow = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!user || !session.active || !session.token) return;

		try {
			if (e.target.checked) {
				// FOLLOW user
				await API.users().putUserFollow(
					`Bearer ${session.token}`,
					session.user_id,
					user.id,
				);
				setIsFollowing(true);
				setAlertMsg("You are now following this user!");
			} else {
				// UNFOLLOW user
				await API.users().deleteUserFollow(
					`Bearer ${session.token}`,
					session.user_id,
					user.id,
				);
				setIsFollowing(false);
				setAlertMsg("You unfollowed this user.");
			}
		} catch (error) {
			setAlertMsg("An error has occurred.");
		}
	}

	if (!session.active) return null;

	if (session.user_id === user.id) {
		return (
			<p>
				<Link href="/profile/edit">Edit Profile</Link>
			</p>
		);
	}

	return (
		<>
			<Link href={`/messages/compose?to=${user.id}`}>
				Send a PM
			</Link>
			<br />
			<input
				type="checkbox"
				id="a_follow"
				checked={isFollowing}
				onChange={changeFollow}
			/>
			<span> Follow this user! </span>
			{alertMsg && <span className="follow_alert">{alertMsg}</span>}
			<br />
		</>
	);
}