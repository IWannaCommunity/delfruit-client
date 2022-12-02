import { ChevronDownIcon } from "@heroicons/react/outline";

function HomeGames() {
	return (
		<nav className="relative py-10">
		<div className="mx-48">
				<h2 className="text-3xl font-semibold mb-4">FANGAMES</h2>
				<hr/>
			</div>
			<div className="flex mx-80 my-8 font-semibold text-2xl whitespace-nowrap space-x-5">
				<h2>SORT</h2>
				<div className="relative inline-block text-left">
					<div>
						<button type="button" className="inline-flex w-full justify-start rounded-md border-t-2 border-x-2 border-b-4 border-gray-400 bg-white text-gray-400 shadow-sm px-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
							TRENDING
							<ChevronDownIcon className="mr-1 ml-2 h-8 w-5"/>
						</button>
					</div>
					<div className="bg-white" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
						<div className="py-1" role="none">
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-1">RECENT</a>
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-2">MOST LIKED</a>
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-3">DIFFICULTY</a>
						</div>
					</div>
				</div>
				<h2>GENRE</h2>
				<div className="relative inline-block text-left">
					<div>
						<button type="button" className="inline-flex justify-start rounded-md border-t-2 border-x-2 border-b-4 border-gray-400 bg-white text-gray-400 shadow-sm px-2" id="menu-button" aria-expanded="true" aria-haspopup="true">
							ALL
							<ChevronDownIcon className="mr-1 ml-2 h-8 w-5"/>
						</button>
					</div>
					<div className="bg-white" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
						<div className="py-1" role="none">
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-1">ADVENTURE</a>
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-2">AVOIDANCE</a>
							<a href="#" className="text-gray-400 block px-4 py-2" role="menuitem" tabIndex="-1" id="sort-item-3">NEEDLE</a>
						</div>
					</div>
				</div>
				<h2>RATING</h2>
				<input id="steps-range" type="range" min="0" max="10" value="0" step="0.1" className="w-40 h-2 mt-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
				<h2>DIFFICULTY</h2>
				<input id="steps-range" type="range" min="0" max="100" value="0" step="0.1" className="w-40 h-2 mt-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
			</div>
		</nav>
	);
}

export default HomeGames;