import { AnyElem } from "@/utils/element";
import Image from "next/image";
import { useSessionContext } from "@/utils/hooks";
import { UsersApi } from "delfruit-swagger-cg-sdk";
import { useState, useEffect } from "react";

const CFG: Config = require("@/config.json");
const USERS_API_CLIENT = new UsersApi(undefined, CFG.apiURL.toString());

export default function ProfileEdit(): AnyElem {
	const [session] = useSessionContext();
	const [bio, setBio] = useState("");
	const [twitch, setTwitch] = useState("");
	const [youtube, setYoutube] = useState("");
	//const [twitter, setTwitter] = useState("");

	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [retypePassword, setRetypePassword] = useState("");

	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
    async function fetchUser() {
      if (!session?.active) return;

      try {
        const response = await USERS_API_CLIENT.getUser(session.user_id);
        const user = response.data;

        setBio(user.bio ?? "");
        if (user.twitchLink) {
          setTwitch(user.twitchLink.replace("https://www.twitch.tv/", ""));
        }
        if (user.youtubeLink) {
          setYoutube(
            user.youtubeLink.replace("https://www.youtube.com/@", "")
          );
        }
      } catch (err) {
        setError("Unable to load user profile.");
      }
    }
    fetchUser();
  }, [session]);


	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isSubmitting) return;
		if (!session.active) { return; }

		setIsSubmitting(true);
		setError(null);
		setSuccess(false);

		if (newPassword && newPassword !== retypePassword) {
			setError("New passwords do not match!");
			return;
		}

		const body: any = {
			bio: bio === "" ? null : bio,
			twitchLink: twitch ? `https://www.twitch.tv/${twitch}` : null,
			youtubeLink: youtube ? `https://www.youtube.com/@${youtube}` : null,
		};

		// Only include password fields if changing password
		if (newPassword) {
			body.currentPassword = oldPassword;
			body.password = newPassword;
		}

		try {
			const response = await USERS_API_CLIENT.patchUser(
				body,
				`Bearer ${session.token}`,
				session.user_id
			);

			setSuccess(true);
			setError(null);
			setOldPassword("");
			setNewPassword("");
			setRetypePassword("");

			setTimeout(() => setIsSubmitting(false), 5000);
		} catch (err: any) {
			setError("An error occured. Could not update profile.");
			setIsSubmitting(false);
		}
	}

	return(
		<>
			<h2>Edit Your Profile</h2>
			<form onSubmit={handleSubmit}>

				<label className="group">
					<span className="group-focus-within:font-bold"> Bio: </span>
					<textarea
						value={bio}
						maxLength={5000}
						onChange={(e) => {
							setBio(e.target.value)
							setSuccess(false);
							setError(null);
						}}
					/>
				</label>

				<div className="flex flex-col gap-2 mt-[1em] !mb-[2em]">							
					<label className="group flex items-center gap-2">
						<Image src="/images/twitch16.png" alt="" width={16} height={16} />
						<span className="w-40 group-focus-within:font-bold">Twitch Channel:</span>
						<span className="text-gray-600 text-sm group-focus-within:font-bold">https://www.twitch.tv/</span>						
						<input
							type="text"
							className="flex-1"
							value={twitch}
							maxLength={25}
							onChange={(e) => {
								setTwitch(e.target.value);
								setSuccess(false);
								setError(null);
							}}
						/>
					</label>

					<label className="group flex items-center gap-2">
						<Image src="/images/youtube16.png" alt="" width={16} height={16} />
						<span className="w-40 group-focus-within:font-bold">YouTube Channel:</span>
						<span className="text-gray-600 text-sm group-focus-within:font-bold">https://www.youtube.com/@</span>					
						<input
							type="text"
							className="flex-1"
							value={youtube}
							onChange={(e) => {
								setYoutube(e.target.value);
								setSuccess(false);
								setError(null);
							}}
						/>
					</label>

					<label className="group flex items-center gap-2">
						<Image src="/images/twitter16.png" alt="" width={16} height={16} />
						<span className="w-40 group-focus-within:font-bold">Twitter Profile:</span>
						<span className="text-gray-600 text-sm group-focus-within:font-bold">https://www.twitter.com/</span>					
						<input
							type="text"
							className="flex-1"
							maxLength={15}
						/>
					</label>
				</div>

				<span className="font-bold underline"> Change your password:</span>
				<div className="flex flex-col gap-2 mt-[1em] !mb-[2em]">
					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold">Old Password:</span>
						<input 
							type="password"
							value={oldPassword}
							onChange={(e) => {
								const value = e.target.value;
								setOldPassword(value)
								setSuccess(false);
								setError(null);
								if (value === "") {
									setNewPassword("");
									setRetypePassword("");
								}
							}}
						/>
					</label>

					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold">New Password:</span>
						<input 
							type="password"
							value={newPassword}
							onChange={(e) => {
								setNewPassword(e.target.value)
								setSuccess(false);
								setError(null);
							}}
							disabled={!oldPassword}
						/>
					</label>

					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold">Retype Password:</span>
						<input 
							type="password"
							value={retypePassword}
							onChange={(e) => {
								setRetypePassword(e.target.value)
								setSuccess(false);
								setError(null);
							}}
							disabled={!newPassword}
						/>
					</label>
				</div>

				<input 
					type="submit" 
					value={"Update Profile"}
  				disabled={isSubmitting}	
					/>
				{error && !success && <span className="text-red-600 ml-1">{error}</span>}
				{success && !error && <span className="text-green-600 ml-1">Profile updated!</span>}
			</form>
		</>
	);
}