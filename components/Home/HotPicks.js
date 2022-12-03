import Image from "next/image";

function HotPicks() {
	return (
		<nav className="bg-[#9FBD63] text-white flex flex-col h-[28rem]">
			<div className="mx-40 my-10">
				<h2 className="text-3xl font-semibold mb-4">HOT PICKS</h2>
				<hr/>
			</div>
			<div className="flex justify-center items-center space-x-10 my-5">
				<Image src="/images/SmallBlackArrowButton-Pre.png" className="cursor-pointer" width={70} height={70}/>
				<Image src="/images/GameThumbnailCard.png" className="cursor-pointer" width={375} height={198}/>
				<Image src="/images/GameThumbnailCard.png" className="cursor-pointer" width={375} height={198}/>
				<Image src="/images/GameThumbnailCard.png" className="cursor-pointer" width={375} height={198}/>
				<Image src="/images/GameThumbnailCard.png" className="cursor-pointer" width={375} height={198}/>
				<Image src="/images/SmallBlackArrowButton-Next.png" className="cursor-pointer" width={70} height={70}/>
			</div>
		</nav>
	);
}

export default HotPicks;