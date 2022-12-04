import Image from "next/image";
import { NewspaperIcon, DotsHorizontalIcon } from "@heroicons/react/outline";

function HomeNews() {
	return (
		<nav className="bg-black bg-news-bg flex h-[22rem] justify-center items-center space-x-10">
			<Image src="/images/CircleArrowButton-Pre.png" className="cursor-pointer" width={60} height={61}/>
			<div className="flex flex-col justify-center items-center w-4/12 h-52 group">
				<div className="bg-[#232123] group-hover:bg-[#D63636] flex text-white font-bold text-lg px-5 rounded-t-lg w-full p-2 h-14">
					<div className="flex-auto justify-start">
						<NewspaperIcon width={30} height={30} />
					</div>
					<div className="flex justify-end">
						New Delfruit Redesign!
					</div>
				</div>
				<div className="overflow-auto flex bg-white font-bold text-[#232123] group-hover:text-[#D63636] rounded-b-lg p-5 h-52 max-h-52 w-full">
					<div className="flex-auto justify-start">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi a venenatis pellentesque. Maecenas elementum in metus ut placerat. Integer eget porttitor ante. 
						Suspendisse ac arcu laoreet, sollicitudin dolor eu, dignissim libero.
						<div className="flex justify-end cursor-pointer">
							<DotsHorizontalIcon width={30} height={30} />
						</div>
					</div>
				</div>
			</div>
			<Image src="/images/CircleArrow-Button-Next.png" className="cursor-pointer" width={60} height={61}/>
		</nav>
	);
}

export default HomeNews;