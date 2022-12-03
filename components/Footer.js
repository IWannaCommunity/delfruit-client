import Image from "next/image";

function Footer() {
	return (
		<nav className="flex text-white bg-[#D63636] bg-footer-bg h-80 rounded-t-[4rem] justify-center items-center">
			<div className="flex basis-1/3 space-x-5 justify-center items-center">
				<p className="text-xl font-semibold cursor-pointer">CONTACT US</p>
				<p className="font-thin"> / </p>
				<p className="text-xl font-semibold cursor-pointer">ABOUT</p>
				<p className="font-thin"> / </p>
				<p className="text-xl font-semibold cursor-pointer">TERMS</p>
			</div>
			<div className="flex basis-1/3 justify-center items-center">
				<div className="flex flex-col">
					<h2 className="text-4xl font-bold mb-2">DELICIOUS FRUIT</h2>
					<p className="text-center">© 2022 IWC LABS</p>
				</div>
			</div>
			<div className="flex basis-1/3 space-x-5 justify-center items-center">
				<Image src="/images/Twitter.png" className="cursor-pointer" width={41} height={40}/>
				<Image src="/images/Discord.png" className="cursor-pointer" width={41} height={40}/>
				<Image src="/images/Twitch.png" className="cursor-pointer" width={41} height={40}/>
			</div>
		</nav>
	)
}

export default Footer;