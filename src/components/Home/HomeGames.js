import GamePreview from "./GamePreview";
import RangeSlider from "../MultiRangeSlider/RangeSlider";

const HomeGames = () => {
	return (
		<nav className="relative py-10 bg-[#F9F9F9]">
			<div className="mx-32">
				<h2 className="text-header font-medium text-[#232123]">FANGAMES</h2>
				<hr/>
			</div>
			<div className="flex my-10 justify-center items-center font-medium text-2xl text-[#232123] space-x-5">
				<h2 className="flex">Sort By:</h2>
				<select id="sort" className="flex py-0 justify-start font-medium text-2xl rounded-md border-t-2 border-x-2 border-b-[5px] border-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636] bg-[#F9F9F9] text-[#BBBBBB]" defaultValue="TRENDING">
					<option value="TRENDING">Trending</option>
					<option value="RECENT">Recent</option>
					<option value="LIKED">Most Liked</option>
					<option value="DIFFICULTY">Difficulty</option>
				</select>
				<h2 className="flex">Genre:</h2>
				<select id="genre" className="flex py-0 justify-start font-medium text-2xl rounded-md border-t-2 border-x-2 border-b-[5px] border-[#BBBBBB] bg-[#F9F9F9] text-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636]" defaultValue="ALL">
					<option value="ALL">All</option>
					<option value="ADVENTURE">Adventure</option>
					<option value="AVOIDANCE">Avoidance</option>
					<option value="NEEDLE">Needle</option>
				</select>
				<h2 className="flex">Rating:</h2>
				<RangeSlider initialMin={0} initialMax={10000} min={0} max={10000} step={100} gap={0} />
				<h2 className="flex">Difficulty:</h2>
				<RangeSlider initialMin={0} initialMax={100000} min={0} max={100000} step={100} gap={0} />
			</div>
			<div className="flex-wrap px-10 xl:px-32 my-10 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:flex justify-center items-center gap-10">
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
				<GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="1920" h="1080" link="/games"/>
			</div>
			<div className="flex justify-center space-x-3 pt-5">
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[100px] h-[50px] cursor-pointer group">
					<svg className="group-hover:fill-[#F9F9F9]" width="13" height="18" viewBox="0 0 13 18" fill="#232123" xmlns="http://www.w3.org/2000/svg">
						<path d="M0.946884 8.89281L9.78647 0.0532225L12.7323 3.00114L6.83855 8.89281L12.7323 14.7845L9.78647 17.7324L0.946884 8.89281Z"/>
					</svg>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#232123] border-[#232123] w-[50px] h-[50px] cursor-pointer group">
					<a className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl text-[#F9F9F9]">1</a>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[50px] h-[50px] cursor-pointer group">
					<a className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl">2</a>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[50px] h-[50px] cursor-pointer group">
					<a className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl">3</a>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[50px] h-[50px] cursor-pointer group">
					<a className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl">4</a>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[50px] h-[50px] cursor-pointer group">
					<a className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl">5</a>
				</div>
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[100px] h-[50px] cursor-pointer group">
					<svg className="group-hover:fill-[#F9F9F9]" width="13" height="18" viewBox="0 0 13 18" fill="#232123" xmlns="http://www.w3.org/2000/svg">
						<path d="M12.0531 9.10719L3.21353 17.9468L0.2677 14.9989L6.16145 9.10719L0.2677 3.21553L3.21353 0.267609L12.0531 9.10719Z"/>
					</svg>
				</div>
			</div>
		</nav>
	);
}

export default HomeGames;