import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import GamePreview from "./GamePreview";

function HotPicks() {
	return (
		<nav className="bg-[#9FBD63] text-white flex flex-col h-[28rem]">
			<div className="mx-40 my-10">
				<h2 className="text-3xl font-semibold mb-4">HOT PICKS</h2>
				<hr/>
			</div>
			<div className="flex justify-center items-center space-x-8 my-5">
				<div className="rounded-full bg-white hover:bg-black w-14 h-14 cursor-pointer group">
					<ChevronLeftIcon className="mx-auto pt-2 fill-black group-hover:fill-white" width={45} height={45}/>
				</div>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="37" h="23"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="37" h="23"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="37" h="23"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="37" h="23"/>
				<div className="rounded-full bg-white hover:bg-black w-14 h-14 cursor-pointer group">
					<ChevronRightIcon className="mx-auto pt-2 fill-black group-hover:fill-white" width={45} height={45}/>
				</div>
			</div>
		</nav>
	);
}

export default HotPicks;