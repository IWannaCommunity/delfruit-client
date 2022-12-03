import Image from "next/image";

function HomeGames() {
	return (
		<nav className="relative py-10">
		<div className="mx-48">
				<h2 className="text-3xl font-semibold mb-4">FANGAMES</h2>
				<hr/>
			</div>
			<div className="flex my-10 justify-center items-center font-semibold text-2xl whitespace-nowrap space-x-5">
				<h2 className="flex mt-1">SORT</h2>
				<select id="sort" className="flex font-semibold text-xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-gray-400 hover:border-[#D63636] hover:text-[#D63636] bg-white text-gray-400 shadow-sm px-2 w-40 h-12" defaultValue="TRENDING">
					<option value="TRENDING">TRENDING</option>
					<option value="RECENT">RECENT</option>
					<option value="LIKED">MOST LIKED</option>
					<option value="DIFFICULTY">DIFFICULTY</option>
				</select>
				<h2 className="flex mt-1">GENRE</h2>
				<select id="genre" className="flex font-semibold text-xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-gray-400 bg-white text-gray-400 hover:border-[#D63636] hover:text-[#D63636] shadow-sm px-2 w-40 h-12" defaultValue="ALL">
					<option value="ALL">ALL</option>
					<option value="ADVENTURE">ADVENTURE</option>
					<option value="AVOIDANCE">AVOIDANCE</option>
					<option value="NEEDLE">NEEDLE</option>
				</select>
				<h2 className="flex mt-1">RATING</h2>
				<input id="steps-range" type="range" min="0" max="10" value="5" step="0.1" className="w-40 h-2 mt-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
				<h2 className="flex mt-1">DIFFICULTY</h2>
				<input id="steps-range" type="range" min="0" max="100" value="50" step="0.1" className="w-40 h-2 mt-4 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
			</div>
			<div className="flex-wrap px-10 xl:px-32 my-10 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:flex justify-center items-center gap-10">
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
				<Image src="/images/GameThumbnailCard.png" layout="responsive" className="cursor-pointer" width={1920} height={1080}/>
			</div>
		</nav>
	);
}

export default HomeGames;