import Image from "next/image";
import { NewspaperIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

function HomeNews() {
	return (
		<nav className="bg-black bg-news-bg flex h-[22rem] justify-center items-center space-x-10">
			<div className="rounded-full bg-[#B1B1B1] border-[#E4E4E4] border-4 bg-opacity-20 border-opacity-50 hover:bg-[#D63636] hover:bg-opacity-50 w-14 h-14 cursor-pointer group">
				<ChevronLeftIcon className="mx-auto pt-2 fill-[#E4E4E4] opacity-50 group-hover:fill-white group-hover:opacity-80" width={40} height={40}/>
			</div>
			<div className="flex flex-col justify-center items-center w-4/12 h-52 group">
				<div className="bg-[#232123] group-hover:bg-[#D63636] flex text-white font-bold text-lg px-5 rounded-t-lg w-full p-2 h-14">
					<div className="flex-auto justify-start">
						<NewspaperIcon width={30} height={30} />
					</div>
					<div className="flex justify-end">
						New Delfruit Redesign!
					</div>
				</div>
				<div className="flex overflow-auto bg-white font-bold text-[#232123] group-hover:text-[#D63636] rounded-b-lg p-5 h-52 max-h-52 w-full">
					<div className="flex-auto justify-start">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi a venenatis pellentesque. Maecenas elementum in metus ut placerat. Integer eget porttitor ante. 
						Suspendisse ac arcu laoreet, sollicitudin dolor eu, dignissim libero.
						<div className="flex justify-end cursor-pointer">
							<DotsHorizontalIcon width={30} height={30} />
						</div>
					</div>
				</div>
				<div className="flex flex-row space-x-5 absolute top-[23rem]">
					<div className="cursor-pointer w-3 h-3 rounded-full bg-white"/>
					<div className="cursor-pointer w-3 h-3 rounded-full bg-white"/>
					<div className="cursor-pointer w-3 h-3 rounded-full bg-white"/>
					<div className="cursor-pointer w-3 h-3 rounded-full bg-white"/>
					<div className="cursor-pointer w-3 h-3 rounded-full bg-white"/>
				</div>
			</div>
			<div className="rounded-full bg-[#B1B1B1] border-[#E4E4E4] border-4 bg-opacity-20 border-opacity-50 hover:bg-[#D63636] hover:bg-opacity-50 w-14 h-14 cursor-pointer group">
				<ChevronRightIcon className="mx-auto pt-2 fill-[#E4E4E4] opacity-50 group-hover:fill-white group-hover:opacity-80" width={40} height={40}/>
			</div>
		</nav>
	);
}

export default HomeNews;