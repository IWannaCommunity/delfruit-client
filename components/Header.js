import Image from "next/image";
import HeaderItem from "./HeaderItem";
import { SearchIcon, UploadIcon, MailIcon, ChevronDownIcon } from "@heroicons/react/outline";

function Header() {
	return (
		<nav className="flex py-2 bg-[#D63636]">
			<header className="flex justify-between items-center h-auto">
				<div className="mx-20 px-20 py-6">
					<Image className="absolute py-14 mx-20 rounded-b-full top-0 px-10 bg-white cursor-pointer" src="/images/cherry.gif" width={50} height={50}/>
				</div>
				<div className="flex font-semibold text-2xl mx-20 space-x-5 h-auto">
					<HeaderItem title='GAMES'/>
					<p className="font-thin"> / </p>
					<HeaderItem title='INTRO'/>
					<p className="font-thin"> / </p>
					<HeaderItem title='WIKI'/>
					<p className="font-thin"> / </p>
					<div className="flex cursor-pointer hover:text-white">
						<ChevronDownIcon height={40} width={25} />
					</div>
				</div>
				<div className="flex ml-20 mr-10 pl-20 input-group items-stretch w-full">
					<input type="search" className="flex form-control w-[30rem] border rounded-l-lg mr-0.5 pl-5 py-2 font-bold text-black" placeholder="Search for games or creators..."/>
					<button className="relative flex block w-12 bg-white rounded-r-lg px-1.5 items-center">
						<SearchIcon stroke="#D63636" width={30} />
					</button>
				</div>
				<div className="flex w-20 space-x-5 h-auto">
					<button>
						<UploadIcon stroke="#FFFFFF" width={30} />
					</button>
					<button>
						<MailIcon stroke="#FFFFFF" width={30} />
					</button>
				</div>
				<div className="cursor-pointer ml-10 p-6 rounded-full bg-white"></div>
			</header>
		</nav>
	)
}

export default Header;