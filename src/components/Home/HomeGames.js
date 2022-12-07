import GamePreview from "./GamePreview";
import RangeSlider from "../MultiRangeSlider/RangeSlider";

function HomeGames() {
	return (
		<nav className="relative py-10">
		<div className="mx-48">
				<h2 className="text-3xl font-semibold mb-4">FANGAMES</h2>
				<hr/>
			</div>
			<div className="flex my-10 justify-center items-center font-semibold text-2xl whitespace-nowrap space-x-5">
				<h2 className="flex mt-1">SORT</h2>
				<select id="sort" className="flex font-semibold text-xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-[#B1B1B1] hover:border-[#D63636] hover:text-[#D63636] bg-white text-[#B1B1B1] shadow-sm px-2 w-40 h-12" defaultValue="TRENDING">
					<option value="TRENDING">TRENDING</option>
					<option value="RECENT">RECENT</option>
					<option value="LIKED">MOST LIKED</option>
					<option value="DIFFICULTY">DIFFICULTY</option>
				</select>
				<h2 className="flex mt-1">GENRE</h2>
				<select id="genre" className="flex font-semibold text-xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-[#B1B1B1] bg-white text-[#B1B1B1] hover:border-[#D63636] hover:text-[#D63636] shadow-sm px-2 w-40 h-12" defaultValue="ALL">
					<option value="ALL">ALL</option>
					<option value="ADVENTURE">ADVENTURE</option>
					<option value="AVOIDANCE">AVOIDANCE</option>
					<option value="NEEDLE">NEEDLE</option>
				</select>
				<h2 className="flex mt-1">RATING</h2>
				<RangeSlider initialMin={0} initialMax={10000} min={0} max={10000} step={100} gap={0} />
				<h2 className="flex mt-1">DIFFICULTY</h2>
				<RangeSlider initialMin={0} initialMax={100000} min={0} max={100000} step={100} gap={0} />
			</div>
			<div className="flex-wrap px-10 xl:px-32 my-10 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:flex justify-center items-center gap-10">
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080"/>
			</div>
		</nav>
	);
}

export default HomeGames;