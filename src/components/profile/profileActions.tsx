import Link from "next/link";
import { useState } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";

type ProfileActionsProps = {
	user: UserExt;
};

export default function ProfileActions({ user }: ProfileActionsProps) {
	const [session] = useSessionContext();
	const [isFollowing, setIsFollowing] = useState(false);

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

				const alertEl = document.querySelector(".follow_alert");
				if (alertEl) {
					alertEl.textContent = "You are now following this user!";
					alertEl.classList.remove("display-none");
				}
			} else {
				// UNFOLLOW user
				await API.users().deleteUserFollow(
					`Bearer ${session.token}`,
					session.user_id,
					user.id,
				);

				const alertEl = document.querySelector(".follow_alert");
				if (alertEl) {
					alertEl.textContent = "You unfollowed this user.";
					alertEl.classList.remove("display-none");
				}
			}
		} catch (error) {
			const alertEl = document.querySelector(".follow_alert");
			if (alertEl) {
				alertEl.textContent = "Operation failed. Please try again.";
				alertEl.classList.remove("display-none");
			}
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
			<span className="follow_alert display-none" />
			<br />
		</>
	);
}