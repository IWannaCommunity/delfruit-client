import Head from "next/head";
import Image from "next/image";
import Footer from "@/components/footer";
import Header from "@/components/header";
import type { AnyElem } from "@/utils/element";

function ContribPortrait(props: {
	name: string;
	title?: string;
	avatarSrc: string;
}): AnyElem {
	return (
		<table className="w-[50%] max-w-[156px] min-w-[156px] mr-8">
			<thead className="w-min inline-block text-[#667] font-[georgia,serif] font-bold">
				{props.name}
			</thead>
			<tbody className="w-[40%]">
				<tr>
					<td>
						<Image
							src={props.avatarSrc}
							alt="Avatar of this user"
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
						/>
					</td>
				</tr>
			</tbody>
			<tfoot
				className="w-min inline-block text-[#667] font-[georgia,serif] font-bold !ml-0"
				style={{ textWrap: "nowrap" }}
			>
				{props.title}
			</tfoot>
		</table>
	);
}

export default function Thanks(): AnyElem {
	return (
		<>
			<Head>
				<title>Special Thanks - Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Developers</h2>
					<div className="flex">
						<ContribPortrait
							name="Starz0r"
							title="Main Developer"
							avatarSrc="/images/avatars/starz0r.png?v=2"
						/>
						<ContribPortrait
							name="TTBB"
							title="Head Assistant"
							avatarSrc="/images/avatars/ttbb.webp?v=2"
						/>
					</div>
					<h2>Moderation</h2>
					<div className="flex flex-wrap">
						<ContribPortrait
							name="Canus"
							avatarSrc="/images/avatars/canus.webp?v=2"
						/>
						<ContribPortrait
							name="GaspacoZanis"
							avatarSrc="/images/avatars/gaspacozanis.webp?v=2"
						/>
						<ContribPortrait
							name="YoluChance"
							avatarSrc="/images/avatars/yoluchance.png?v=2"
						/>
						<ContribPortrait
							name="PlasmaNapkin"
							avatarSrc="/images/avatars/plasmanapkin.png?v=2"
						/>
						<ContribPortrait
							name="pieceofcheese87"
							avatarSrc="/images/avatars/pieceofcheese.png?v=2"
						/>
					</div>
					<h2>Alumni</h2>
					<div className="flex flex-wrap">
						<ContribPortrait
							name="Patrick"
							avatarSrc="/images/avatars/patrick.webp?v=2"
						/>
						<ContribPortrait
							name="Nader"
							avatarSrc="/images/avatars/nader.png?v=2"
						/>
						<ContribPortrait
							name="RandomErik"
							avatarSrc="/images/avatars/randomerik.jpg?v=2"
						/>
						<ContribPortrait
							name="Onynekyu"
							avatarSrc="/images/avatars/onynekyu.jpg?v=2"
						/>
						<ContribPortrait
							name="ElZorgo"
							avatarSrc="/images/avatars/el_zorgo.png?v=2"
						/>
						<ContribPortrait 
							name="Lss" 
							avatarSrc="/images/avatars/lss40.png?v=2" 
						/>
						<ContribPortrait
							name="Dappermink"
							avatarSrc="/images/avatars/quentinjanuel.png?v=2"
						/>
						<ContribPortrait
							name="Artardss"
							avatarSrc="/images/avatars/artardss.jpg?v=2"
						/>
						<ContribPortrait
							name="Normal"
							avatarSrc="/images/avatars/normal.png?v=2"
						/>
						<ContribPortrait
							name="Shinobu"
							avatarSrc="/images/avatars/shinobu.jpg?v=2"
						/>
						<ContribPortrait
							name="Sudnep"
							avatarSrc="/images/avatars/sudnep.png?v=2"
						/>
					</div>
					<h2>Original Designers</h2>
					<div className="flex">
						<ContribPortrait
							name="klazen0108"
							avatarSrc="/images/avatars/klazen0108.png?v=2"
						/>
						<ContribPortrait
							name="tehjman1993"
							avatarSrc="/images/avatars/tehjman1993.webp?v=2"
						/>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
