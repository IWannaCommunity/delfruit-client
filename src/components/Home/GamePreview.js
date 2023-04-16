import Link from "next/link";
import Image from "next/image";

const GamePreview = ({title, image, w, h, link}) => {
	return (
		<Link href={link}>
			<div className="relative mx-auto rounded-lg cursor-pointer group drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]">
				<div className="absolute top-0 left-0 right-0 px-4 py-6 bg-[#232123] group-hover:bg-[#D63636] bg-opacity-70 rounded-t-lg">
					<h3 className="absolute text-lg font-semibold text-[#F9F9F9] top-3 right-5">{title}</h3>
				</div>
				<Image src={image} className="rounded-lg" width={w} height={w}/>
				<svg className="absolute bottom-5 right-20 hidden group-hover:flex" width="40" height="37" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fillRule="evenodd" clipRule="evenodd" d="M20 3.24132C31.0953 -8.01158 58.8361 11.6798 20 37C-18.8361 11.6822 8.9047 -8.01158 20 3.24132Z" fill="#D63636"/>
				</svg>
				<svg className="absolute bottom-5 right-5 hidden group-hover:flex" width="38" height="37" viewBox="0 0 38 37" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0.595154 34.049L19 0L37.4048 34.049C38.1251 35.3815 37.1602 37 35.6454 37H2.35457C0.839797 37 -0.125145 35.3815 0.595154 34.049Z" fill="#1EB475"/>
				</svg>
			</div>
		</Link>
	);
}

export default GamePreview;