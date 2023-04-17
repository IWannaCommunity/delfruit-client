import Image from "next/image";

const GameReviews = ({count}) => {
	return (
		<nav className="text-[#232123] bg-[#F9F9F9]">
			<div className="relative flex-col mx-40 my-10">
				<h2 className="absolute top-0 left-0 text-header font-medium mb-4">REVIEWS</h2>
				<div className="absolute top-3 right-0 text-xl">
					<a>{count} total</a>
				</div>
				<hr className="relative top-10"/>
			</div>
			<div className="flex my-20 mx-40 font-medium text-2xl space-x-5">
				<h2 className="flex">Sort By:</h2>
				<select id="sort" className="flex py-0 font-medium text-2xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636] bg-[#F9F9F9] text-[#BBBBBB]" defaultValue="Best">
					<option value="Best">Best</option>
					<option value="Recent">Recent</option>
				</select>
			</div>
			<div className="flex my-10 justify-center items-center">
				<div className="cursor-pointer w-[50px] h-[50px] rounded-full border border-[#232123]"></div>
			</div>
		</nav>
	);
}

export default GameReviews;