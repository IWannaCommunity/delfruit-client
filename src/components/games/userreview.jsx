import Image from "next/image";
import UserComment from "./usercomment";
import { WebmasterBadge } from "../icons";

export default function UserReview(props) {
	return (
		<div className="flex flex-row items-start p-0 gap-6 w-[876px] h-[124px] self-center">
			{/*	
				<Image className="box-border w-[50px] h-[50px] border-[1px] border-solid border-[#232123]" />
                */}
			{/* HACK: invisible padding div thanks to more webdev retardation */}
			<div className="w-[50px]" />
			<UserComment
				name={props.author ?? "Unknown"}
				pinned={false}
				rating={props.rating}
				difficulty={props.difficulty}
			/>
		</div>
	);
}
