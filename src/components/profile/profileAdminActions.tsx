import { PartialUserCan_, UserExt } from "delfruit-swagger-cg-sdk";
import { useCallback, useEffect, useState } from "react";
import { API } from "@/utils/api";
import { useSessionContext } from "@/utils/hooks";

type UserInfoProps = {
	user: UserExt;
};

export default function ProfileAdminActions({ user }: UserInfoProps) {
	const [session] = useSessionContext();
	const [can, setCan] = useState<PartialUserCan_ | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [emailInput, setEmailInput] = useState("");
	const [hideAdminEmailInput, setHideAdminEmailInput] = useState(true);
	const [adminEmailAlertText, setAdminEmailAlertText] = useState("");

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

			try {
				const resp = await API.users().getUser(user.id, `Bearer ${session.token}`);

				setEmailInput(resp.data.email ?? "");
				setHideAdminEmailInput(true);
				setAdminEmailAlertText("");
			} catch {
				setError("Some user data was not loaded.");
			}
		})();
	}, [session.active, session.admin, user, user?.id, session.token]);

	const actionAdminChangeUserEmail = useCallback(async () => {
		try {
			await API.users().patchUserEmail({ newEmail: emailInput }, user.id);

			setAdminEmailAlertText("Email updated successfully!");
			setEmailInput("");
			setHideAdminEmailInput(true);
		} catch {
			setAdminEmailAlertText("Failed to update email.");
		}
	}, [user?.id, emailInput]);

	const actionResendVerificationEmail = useCallback(async () => {
		try {
			await API.users().postUserResendRegistrationEmail(user.id, {
				headers: { Authorization: `Bearer ${session.token}` },
			});
		} catch {
			setError("Verification email could not be resent.");
		}
	}, [user, session]);

	const togglePermission = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof PartialUserCan_) => {
		if (!user || !session.active || !session.token || !can) return;

		const checked = e.target.checked;

		try {
			await API.users().patchUserCan({ [key]: checked }, user.id);

			setCan((prev) => {
				return prev ? { ...prev, [key]: checked } : prev;
			});

			setError(null);
		} catch {
			setError("Failed to change permissions");
		}
	};

	if (!session.active && !session.admin) return null;
	if (!can) {
		return <span>Loading permissions...</span>;
	}

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
			<div className="text-right">
				<input
					id="admin-email-input"
					type="email"
					className="w-[95%]"
					value={emailInput}
					onChange={(e) => setEmailInput(e.target.value)}
					hidden={hideAdminEmailInput}
				/>

				<button
					id="admin-change-email"
					type="button"
					hidden={!hideAdminEmailInput}
					onClick={() => {
						setEmailInput("");
						setAdminEmailAlertText("");
						setHideAdminEmailInput(false);
					}}
				>
					Change Email
				</button>

				<button
					id="admin-save-change-email"
					type="submit"
					hidden={hideAdminEmailInput}
					className="mr-1 mb-1"
					onClick={async (evt) => {
						evt.preventDefault();
						await actionAdminChangeUserEmail();
					}}
				>
					Change
				</button>

				<button
					id="admin-discard-change-email"
					type="button"
					hidden={hideAdminEmailInput}
					onClick={(evt) => {
						evt.preventDefault();
						setEmailInput("");
						setHideAdminEmailInput(true);
						setAdminEmailAlertText("");
					}}
				>
					Cancel
				</button>

				<span className="ml-1">{adminEmailAlertText}</span>

				<button
					id="admin-resend-verification-email"
					type="submit"
					onClick={(evt) => {
						evt.preventDefault();
						actionResendVerificationEmail();
					}}
				>
					Resend Verification Email
				</button>
			</div>
		</>
	);
}
