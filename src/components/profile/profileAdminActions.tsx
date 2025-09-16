import { useState } from "react";
import { UserExt } from "delfruit-swagger-cg-sdk";
import { useSessionContext } from "@/utils/hooks";
import { API } from "@/utils/api";
import { Permission, EditUserPermissionsParam } from "delfruit-swagger-cg-sdk";

type UserInfoProps = {
	user: UserExt;
};

export default function ProfileAdminActions({ user }: UserInfoProps) {
	const [session] = useSessionContext();
	const [permissions, setPermissions] = useState<Permission[] | null>([]); // TODO: SAVE PERMISSION STATE (NO GET CALL AVAILABLE CURRENTLY)
	const [error, setError] = useState<string | null>(null);

	const togglePermission = async (
		e: React.ChangeEvent<HTMLInputElement>,
		perm: Permission
	) => {
		if (!user || !session.active || !session.token) return;

		const checked = e.target.checked;
		
		try {
			if (checked) {
      	await API.users().patchUsersPermissions(user.id, perm, {
					// I'm forced to put a date here since backend doesn't handle null properly
					// But this essentially means not revoked
        	revokedUntil: new Date("1970-01-02T00:00:00Z").toISOString()
      	} as any);
			} else {
				await API.users().patchUsersPermissions(user.id, perm, {
					// The Epochalypse is coming...
					revokedUntil: new Date("2037-12-31T23:59:59Z").toISOString()
				} as any);
			}
			
      setPermissions((prev) =>
        checked ? [...prev, perm] : prev.filter((p) => p !== perm)
      );
			setError(null);
		} catch (error) {
			setError("Failed to change permissions");
		}
	}

	if (!session.active && !session.admin) return null;

	return (
		<>
			<input
				id="chk_games"
				type="checkbox"
				checked={permissions.includes(Permission.CANSUBMIT)}
        onChange={(e) => togglePermission(e, Permission.CANSUBMIT)}
			/>
			<span> Can submit new games</span>
			<br />
			<input
				id="chk_report"
				type="checkbox"
				checked={permissions.includes(Permission.CANREPORT)}
        onChange={(e) => togglePermission(e, Permission.CANREPORT)}
			/> 
			<span> Can report</span>
			<br />
			<input
				id="chk_screenshot" 
				type="checkbox"
				checked={permissions.includes(Permission.CANSCREENSHOT)}
        onChange={(e) => togglePermission(e, Permission.CANSCREENSHOT)}
			/> 
			<span> Can submit screenshots</span>
			<br />
			<input
				id="chk_review" 
				type="checkbox"
				checked={permissions.includes(Permission.CANREVIEW)}
        onChange={(e) => togglePermission(e, Permission.CANREVIEW)}
			/> 
			<span> Can submit reviews</span>
			<br />
			<input
				id="chk_message" 
				type="checkbox"
				checked={permissions.includes(Permission.CANMESSAGE)}
        onChange={(e) => togglePermission(e, Permission.CANMESSAGE)}
			/> 
			<span> Can send Private Messages</span>
			<br />
			{error && <span className="text-red-600">{error}</span>}
		</>
	);
}