import Image from "next/image";
import HeaderItem from "./headeritem";
import Link from "next/link";
import { useSessionContext } from "../utils/session";

const Header = () => {
	const [session, setSession] = useSessionContext();

	return (
		<nav className="flex py-2 h-[60px] w-full bg-[#D63636]">
			<header className="flex justify-between items-center h-auto">
				<Link href="/">
					<div className="mx-20 px-20 py-6 group">
						<div className="absolute py-12 group-hover:py-[50px] mx-20 rounded-b-full top-0 px-10 bg-[#F9F9F9] cursor-pointer">
							<Image
								src="/images/cherry.gif"
								className="absolute top-5 group-hover:top-4 right-4"
								width={48}
								height={55}
							/>
						</div>
					</div>
				</Link>
				<div className="flex text-2xl mx-14 space-x-7 font-semibold items-center">
					<HeaderItem title="GAMES" />
					<svg
						width="12"
						height="30"
						viewBox="0 0 12 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="0.530154"
							y1="29.0198"
							x2="10.7908"
							y2="0.829007"
							stroke="#E4E4E4"
						/>
					</svg>
					<HeaderItem title="INTRO" />
					<svg
						width="12"
						height="30"
						viewBox="0 0 12 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="0.530154"
							y1="29.0198"
							x2="10.7908"
							y2="0.829007"
							stroke="#E4E4E4"
						/>
					</svg>
					<HeaderItem title="WIKI" />
					<svg
						width="12"
						height="30"
						viewBox="0 0 12 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<line
							x1="0.530154"
							y1="29.0198"
							x2="10.7908"
							y2="0.829007"
							stroke="#E4E4E4"
						/>
					</svg>
					<div className="flex cursor-pointer">
						<svg
							className="hover:fill-[#F9F9F9]"
							width="18"
							height="12"
							viewBox="0 0 18 12"
							xmlns="http://www.w3.org/2000/svg"
							fill="#E4E4E4"
						>
							<path d="M8.83958 11.7854L0 2.94583L2.94792 0L8.83958 5.89375L14.7313 0L17.6792 2.94583L8.83958 11.7854Z" />
						</svg>
					</div>
				</div>
				<div className="flex pl-20 input-group items-stretch w-full">
					<input
						type="search"
						className="flex form-control w-[30rem] h-[40px] rounded-l-lg border-[#F9F9F9] mr-0.5 pl-5 py-2 font-normal text-xl text-[#232123] placeholder-[#BBBBBB]"
						placeholder="Search for games or creators..."
					/>
					<button className="relative flex block w-12 h-[40px] bg-[#F9F9F9] rounded-r-lg px-2 items-center">
						<svg
							width="25"
							height="25"
							viewBox="0 0 25 25"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.6912 21.3812C13.0633 21.3807 15.367 20.5867 17.2355 19.1255L23.1103 25L25 23.1104L19.1252 17.2359C20.5872 15.3673 21.3818 13.0632 21.3824 10.6906C21.3824 4.79608 16.586 0 10.6912 0C4.79633 0 0 4.79608 0 10.6906C0 16.5851 4.79633 21.3812 10.6912 21.3812ZM10.6912 2.67265C15.1133 2.67265 18.7096 6.26871 18.7096 10.6906C18.7096 15.1125 15.1133 18.7086 10.6912 18.7086C6.26904 18.7086 2.6728 15.1125 2.6728 10.6906C2.6728 6.26871 6.26904 2.67265 10.6912 2.67265Z"
								fill="#D63636"
							/>
						</svg>
					</button>
				</div>
				<div className="flex ml-10 space-x-10">
					{session.active && (
						<button>
							<svg
								className="hover:fill-[#F9F9F9]"
								width="24"
								height="29"
								viewBox="0 0 24 29"
								fill="#E4E4E4"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M4.1 11.7621H6.81625V20.3038C6.81625 21.2433 7.585 22.0121 8.52458 22.0121H15.3579C16.2975 22.0121 17.0663 21.2433 17.0663 20.3038V11.7621H19.7825C21.3029 11.7621 22.0717 9.91709 20.9954 8.84084L13.1542 0.999592C12.9961 0.841223 12.8084 0.715579 12.6017 0.629853C12.3951 0.544126 12.1735 0.5 11.9498 0.5C11.7261 0.5 11.5045 0.544126 11.2979 0.629853C11.0912 0.715579 10.9035 0.841223 10.7454 0.999592L2.90417 8.84084C1.82792 9.91709 2.57958 11.7621 4.1 11.7621ZM0 27.1371C0 28.0767 0.76875 28.8454 1.70833 28.8454H22.2083C23.1479 28.8454 23.9167 28.0767 23.9167 27.1371C23.9167 26.1975 23.1479 25.4288 22.2083 25.4288H1.70833C0.76875 25.4288 0 26.1975 0 27.1371Z" />
							</svg>
						</button>
					)}
					{session.active && (
						<button>
							<svg
								className="hover:fill-[#F9F9F9]"
								width="32"
								height="22"
								viewBox="0 0 32 22"
								fill="#E4E4E4"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M29.2151 0.336303L17.0421 11.185C16.7597 11.4368 16.3946 11.576 16.0162 11.576C15.6378 11.576 15.2726 11.4368 14.9902 11.185L2.76631 0.34247C3.05814 0.253464 3.36155 0.208263 3.66665 0.208345H28.3333C28.6319 0.208074 28.929 0.251177 29.2151 0.336303ZM31.3056 2.47151C31.3781 2.73359 31.4166 3.00801 31.4166 3.29168V18.7083C31.4166 19.5261 31.0918 20.3104 30.5136 20.8886C29.9353 21.4668 29.1511 21.7917 28.3333 21.7917H3.66665C2.8489 21.7917 2.06464 21.4668 1.4864 20.8886C0.908165 20.3104 0.583315 19.5261 0.583315 18.7083V3.29168C0.58301 3.01351 0.620349 2.73658 0.694315 2.46843L12.9382 13.4883C13.7854 14.2433 14.8806 14.6605 16.0154 14.6605C17.1502 14.6605 18.2454 14.2433 19.0926 13.4883L31.3056 2.47151Z" />
							</svg>
						</button>
					)}
					{/*<div className="cursor-pointer w-[50px] h-[50px] rounded-full bg-[#F9F9F9]"></div>*/}
					{session.active && (
						<svg
							className="stroke-[#E4E4E4] hover:stroke-[#F9F9F9]"
							width="50px"
							height="50px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle cx="12" cy="9" r="3" stroke-width="1.5" />
							<path
								d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
							<path
								d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
								stroke-width="1.5"
								stroke-linecap="round"
							/>
						</svg>
					)}
				</div>
			</header>
		</nav>
	);
};

export default Header;
