import { AnyElem } from "@/utils/element";
import Image from "next/image";

export default function ProfileEdit(): AnyElem {
	
	return(
		<>
			<h2>Edit Your Profile</h2>
			<form>

				<label className="group">
					<span className="group-focus-within:font-bold"> Bio: </span>
					<textarea />
				</label>

				<div className="flex flex-col gap-2 mt-[1em] !mb-[2em]">							
					<label className="group flex items-center gap-2">
						<Image src="/images/twitch16.png" alt="" width={16} height={16} />
						<span className="w-40 group-focus-within:font-bold">Twitch Channel:</span>
						<input type="text" className="flex-1" />
					</label>

					<label className="group flex items-center gap-2">
						<Image src="/images/youtube16.png" alt="" width={16} height={16}/>
						<span className="w-40 group-focus-within:font-bold">YouTube Channel:</span>
						<input type="text" className="flex-1" />
					</label>

					<label className="group flex items-center gap-2">
						<Image src="/images/twitter16.png" alt="" width={16} height={16}/>
						<span className="w-40 group-focus-within:font-bold">Twitter Profile:</span>
						<input type="text" className="flex-1"/>
					</label>
				</div>

				<span className="font-bold underline"> Change your password:</span>
				<div className="flex flex-col gap-2 mt-[1em] !mb-[2em]">
					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold"> Old Password: </span>
						<input type="password"/>
					</label>

					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold"> New Password: </span>
						<input type="password"/>
					</label>

					<label className="group flex items-center gap-2">
						<span className="w-40 group-focus-within:font-bold"> Confirm: </span>
						<input type="password"/>
					</label>
				</div>

				<input type="submit" value="Update Profile"/>
			</form>
		</>
	);
}