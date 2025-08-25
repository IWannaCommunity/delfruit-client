import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type CarouselProps = {
	images: { src: URL | string; alt?: string }[];
};

export default function Carousel({ images }: CarouselProps): JSX.Element {
	const [current, setCurrent] = useState(0);
	const [paused, setPaused] = useState(false);
	const thumbsRef = useRef<HTMLDivElement>(null);

	const hasImages = images.length > 0;
	const thumbWidth = 120;

	const scrollThumbnails = (index: number) => {
		if (!thumbsRef.current) return;

		const container = thumbsRef.current;
		const containerWidth = container.clientWidth;
		const maxScroll = container.scrollWidth - containerWidth;

		// Center the thumbnail
		let scrollTo = index * thumbWidth - containerWidth / 2 + thumbWidth / 2;

		// Clamp so it doesn't overscroll
		if (scrollTo < 0) scrollTo = 0;
		if (scrollTo > maxScroll) scrollTo = maxScroll;

		container.scrollTo({
			left: scrollTo,
			behavior: "smooth",
		});
	};

	const next = () => {
		setCurrent((prev) => {
			const nextIndex = (prev + 1) % images.length;
			scrollThumbnails(nextIndex);
			return nextIndex;
		});
	};

	const prev = () => {
		setCurrent((prev) => {
			const prevIndex = (prev - 1 + images.length) % images.length;
			scrollThumbnails(prevIndex);
			return prevIndex;
		});
	};

	// autoscroller
	useEffect(() => {
		if (!hasImages || paused) return;
		const interval = setInterval(() => {
			next();
		}, 5000);
		return () => clearInterval(interval);
	}, [hasImages, paused]);

	// Keep thumbnails synced when the index changes
	useEffect(() => {
		if (!thumbsRef.current || images.length <= 1) return;
		scrollThumbnails(current);
	}, [current, images.length]);

	return (
		<div className="ml-[50%]">
			<h2 className="mb-4">Screenshots</h2>

			<div className="float-left w-[370px]">
				{/* Main */}
				<div
					className="group relative h-[250px] w-[350px] bg-[#fafafa] border border-solid border-[#e5e5e5] px-[10px] pb-[40px] pt-[10px] text-center"
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}
				>
					{hasImages ? (
						<Link href="/">
							<div className="relative h-full w-full">
								{images.map((img, index) => (
									<Image
										key={index}
										src={img.src}
										alt={img.alt || `Screenshot ${index + 1}`}
										width={350}
										height={250}
										className={`absolute top-0 left-0 h-full max-w-[350px] 
										object-contain transition-opacity duration-500 ease-in-out 
										${current === index ? "opacity-100" : "opacity-0"}`}
									/>
								))}
							</div>
						</Link>
					) : (
						<div className="text-center text-gray-500 p-6">
							No Screenshots for this game... Why not add one?
						</div>
					)}

					{/* Nav arrows */}
					{hasImages && (
						<>
							{/* Prev */}
							<a
								className="absolute block bg-no-repeat h-full w-[50px] top-[10px] left-[10px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
								style={{
									backgroundImage: `url(/images/prev.png)`,
									backgroundPositionX: "left",
									backgroundPositionY: "45%",
								}}
								onClick={(e) => {
									e.preventDefault();
									prev();
								}}
							></a>

							{/* Next */}
							<a
								className="absolute block bg-no-repeat h-full w-[50px] top-[10px] right-[10px] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
								style={{
									backgroundImage: `url(/images/next.png)`,
									backgroundPositionX: "right",
									backgroundPositionY: "45%",
								}}
								onClick={(e) => {
									e.preventDefault();
									next();
								}}
							></a>

							{/* Counter */}
							<span className="absolute bottom-[45px] left-[15px] bg-black bg-opacity-[0.7] text-[11px] text-center text-white p-[3px] rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity">
								{current + 1}/{images.length}
							</span>

							{/* Caption */}
							<div className="absolute border border-solid border-[#141414] bg-black bg-opacity-[0.7] text-[11px] text-[#fafafa] text-right p-[4px] bottom-[30px] right-[10px] block opacity-0 group-hover:opacity-100 transition-opacity">
								by User
							</div>
						</>
					)}

					{/* Text Nav */}
					{hasImages && (
						<div className="overflow-hidden mt-[10px] bottom-[10px] absolute w-[350px]">
							<span className="float-left w-auto block text-[12px] p-[4px]">
								Previous
							</span>
							<span className="float-right w-auto block text-[12px] p-[4px]">
								Next
							</span>
						</div>
					)}
				</div>

				{/* Thumbnails */}
				{hasImages && (
					<div
						ref={thumbsRef}
						className="py-[15px] px-[5px] overflow-x-scroll overflow-y-hidden relative block scroll-smooth scrollbar-hide"
					>
						<div className="relative h-[90px] w-max">
							<ul className="overflow-hidden relative top-[0px] m-[0px] p-[0px] left-[0px] h-[75px] flex">
								{images.map((img, index) => (
									<li
										key={index}
										className="list-none mr-[10px] w-[99px] h-[74px] overflow-hidden p-[3px] ml-[5px] my-[0px] border border-solid border-[#e5e5e5] cursor-pointer"
										onClick={() => setCurrent(index)}
									>
										<div className="relative h-full text-center align-middle overflow-hidden">
											<Image
												src={img.src}
												alt={img.alt || `Thumbnail ${index + 1}`}
												width={99}
												height={74}
												className={`inline w-full hover:opacity-100 transition-opacity ${
													current === index ? "opacity-100" : "opacity-50"
												}`}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

