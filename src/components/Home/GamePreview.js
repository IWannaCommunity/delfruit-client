import Image from "next/image";

function GamePreview({title, image, w, h}) {
	return (
		<div className="relative mx-auto rounded-lg cursor-pointer group drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]">
			<div className="absolute top-0 left-0 right-0 px-4 py-6 bg-[#232123] group-hover:bg-[#D63636] bg-opacity-70 rounded-t-lg">
				<h3 className="absolute text-xl font-semibold text-white top-3 right-5">{title}</h3>
			</div>
			<Image src={image} className="rounded-lg" width={w} height={w}/>
			<Image src="/images/Heart.png" className="absolute bottom-5 right-20 hidden group-hover:flex" width={40} height={37}/>
			<Image src="/images/Vector.png" className="absolute bottom-5 right-5 hidden group-hover:flex" width={40} height={37}/>
		</div>
	);
}

export default GamePreview;