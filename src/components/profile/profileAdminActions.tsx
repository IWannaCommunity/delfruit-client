import { useState, useEffect } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { PartialUserCan_ } from "delfruit-swagger-cg-sdk";

type UserInfoProps = {
	user: UserExt;
};

export default function ProfileAdminActions({ user }: UserInfoProps) {
	const [session] = useSessionContext();
	const [can, setCan] = useState<PartialUserCan_ | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!session.active || !session.admin || !user) return;

		(async () => {
			try {
				const res = await API.users().getUsersCan(user.id);
				setCan(res.data);
				setError(null);
			} catch {
				setError("Failed to load user permissions");
			}
		})();
	}, [session.active, session.admin, user?.id]);

	const togglePermission = async (
		e: React.ChangeEvent<HTMLInputElement>,
		key: keyof PartialUserCan_
	) => {
		if (!user || !session.active || !session.token || !can) return;

		const checked = e.target.checked;

		try {
			await API.users().patchUserCan(
				{ [key]: checked },
				user.id
			);

			setCan((prev) =>
				prev ? { ...prev, [key]: checked } : prev
			);

			setError(null);
		} catch {
			setError("Failed to change permissions");
		}
	};

	if (!session.active && !session.admin) return null;
	if (!can) { return <span>Loading permissions...</span>; }

	return (
		<>
			<input
				id="chk_games"
				type="checkbox"
				checked={!!can?.canSubmit}
				onChange={(e) => togglePermission(e, "canSubmit")}
			/>
			<span> Can submit new games</span>
			<br />
			<input
				id="chk_report"
				type="checkbox"
				checked={!!can?.canReport}
				onChange={(e) => togglePermission(e, "canReport")}
			/> 
			<span> Can report</span>
			<br />
			<input
				id="chk_screenshot" 
				type="checkbox"
				checked={!!can?.canScreenshot}
				onChange={(e) => togglePermission(e, "canScreenshot")}
			/> 
			<span> Can submit screenshots</span>
			<br />
			<input
				id="chk_review" 
				type="checkbox"
				checked={!!can?.canReview}
				onChange={(e) => togglePermission(e, "canReview")}
			/> 
			<span> Can submit reviews</span>
			<br />
			<input
				id="chk_message" 
				type="checkbox"
				checked={!!can?.canMessage}
				onChange={(e) => togglePermission(e, "canMessage")}
			/> 
			<span> Can send Private Messages</span>
			<br />
			{error && <span className="text-red-600">{error}</span>}
		</>
	);
}