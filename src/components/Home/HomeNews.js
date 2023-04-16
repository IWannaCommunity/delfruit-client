import Image from "next/image";
import { NewspaperIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import { ChevronRightIcon } from "@heroicons/react/solid";

const HomeNews = () => {
	return (
		<nav className="bg-[#232123] bg-news-bg flex h-[22rem] justify-center items-center space-x-10">
			<div className="flex rounded-full bg-[#B1B1B1] border-[#E4E4E4] border-2 bg-opacity-20 border-opacity-50 hover:bg-[#D63636] hover:bg-opacity-50 w-[60px] h-[60px] cursor-pointer items-center justify-center">
				<svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M0.946884 9.39271L9.78647 0.553123L12.7323 3.50104L6.83855 9.39271L12.7323 15.2844L9.78647 18.2323L0.946884 9.39271Z" fill="#E4E4E4"/>
				</svg>
			</div>
			<div className="flex flex-col justify-center items-center w-4/12 h-52 group">
				<div className="bg-[#232123] group-hover:bg-[#D63636] flex text-[#F9F9F9] font-semibold text-lg px-5 rounded-t-lg w-full p-2 h-14">
					<div className="flex-auto justify-start">
						<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M16.7322 20.2678C17.2011 20.7366 17.837 21 18.5 21H4.75C3.75544 21 2.80161 20.6049 2.09835 19.9017C1.39509 19.1984 1 18.2446 1 17.25V2.25C1 1.91848 1.1317 1.60054 1.36612 1.36612C1.60054 1.1317 1.91848 1 2.25 1H14.75C15.0815 1 15.3995 1.1317 15.6339 1.36612C15.8683 1.60054 16 1.91848 16 2.25V3.5V18.5C16 19.163 16.2634 19.7989 16.7322 20.2678ZM4 4C2.89543 4 2 4.89543 2 6C2 7.10457 2.89543 8 4 8H13C14.1046 8 15 7.10457 15 6C15 4.89543 14.1046 4 13 4H4ZM4 9C2.89543 9 2 9.89543 2 11C2 12.1046 2.89543 13 4 13H13C14.1046 13 15 12.1046 15 11C15 9.89543 14.1046 9 13 9H4ZM4 14C2.89543 14 2 14.8954 2 16C2 17.1046 2.89543 18 4 18H13C14.1046 18 15 17.1046 15 16C15 14.8954 14.1046 14 13 14H4Z" fill="#F9F9F9"/>
							<path d="M18.5 22C19.0523 22 19.5 21.5523 19.5 21C19.5 20.4477 19.0523 20 18.5 20V22ZM16.7322 20.2678L16.0251 20.9749L16.0251 20.9749L16.7322 20.2678ZM2.09835 19.9017L1.39124 20.6088H1.39124L2.09835 19.9017ZM1.36612 1.36612L0.65901 0.65901L0.65901 0.65901L1.36612 1.36612ZM15.6339 1.36612L16.341 0.65901L15.6339 1.36612ZM16 2.5C15.4477 2.5 15 2.94772 15 3.5C15 4.05228 15.4477 4.5 16 4.5V2.5ZM18.5 20C17.9477 20 17.5 20.4477 17.5 21C17.5 21.5523 17.9477 22 18.5 22V20ZM15 18.5C15 19.0523 15.4477 19.5 16 19.5C16.5523 19.5 17 19.0523 17 18.5H15ZM17 2.25C17 1.69772 16.5523 1.25 16 1.25C15.4477 1.25 15 1.69772 15 2.25H17ZM18.5 20C18.1022 20 17.7206 19.842 17.4393 19.5607L16.0251 20.9749C16.6815 21.6313 17.5717 22 18.5 22V20ZM4.75 22H18.5V20H4.75V22ZM1.39124 20.6088C2.28204 21.4996 3.49022 22 4.75 22V20C4.02065 20 3.32118 19.7103 2.80546 19.1945L1.39124 20.6088ZM0 17.25C0 18.5098 0.500445 19.718 1.39124 20.6088L2.80546 19.1945C2.28973 18.6788 2 17.9793 2 17.25H0ZM0 2.25V17.25H2V2.25H0ZM0.65901 0.65901C0.237054 1.08097 0 1.65326 0 2.25H2C2 2.1837 2.02634 2.12011 2.07322 2.07322L0.65901 0.65901ZM2.25 0C1.65326 0 1.08097 0.237054 0.65901 0.65901L2.07322 2.07322C2.12011 2.02634 2.1837 2 2.25 2V0ZM14.75 0H2.25V2H14.75V0ZM16.341 0.65901C15.919 0.237054 15.3467 0 14.75 0V2C14.8163 2 14.8799 2.02634 14.9268 2.07322L16.341 0.65901ZM17 2.25C17 1.65326 16.7629 1.08097 16.341 0.65901L14.9268 2.07322C14.9737 2.12011 15 2.1837 15 2.25H17ZM17 3.5V2.25H15V3.5H17ZM17 18.5V3.5H15V18.5H17ZM17.4393 19.5607C17.158 19.2794 17 18.8978 17 18.5H15C15 19.4283 15.3687 20.3185 16.0251 20.9749L17.4393 19.5607ZM3 6C3 5.44772 3.44772 5 4 5V3C2.34315 3 1 4.34315 1 6H3ZM4 7C3.44772 7 3 6.55228 3 6H1C1 7.65685 2.34315 9 4 9V7ZM13 7H4V9H13V7ZM14 6C14 6.55228 13.5523 7 13 7V9C14.6569 9 16 7.65685 16 6H14ZM13 5C13.5523 5 14 5.44772 14 6H16C16 4.34315 14.6569 3 13 3V5ZM4 5H13V3H4V5ZM3 11C3 10.4477 3.44772 10 4 10V8C2.34315 8 1 9.34315 1 11H3ZM4 12C3.44772 12 3 11.5523 3 11H1C1 12.6569 2.34315 14 4 14V12ZM13 12H4V14H13V12ZM14 11C14 11.5523 13.5523 12 13 12V14C14.6569 14 16 12.6569 16 11H14ZM13 10C13.5523 10 14 10.4477 14 11H16C16 9.34315 14.6569 8 13 8V10ZM4 10H13V8H4V10ZM3 16C3 15.4477 3.44772 15 4 15V13C2.34315 13 1 14.3431 1 16H3ZM4 17C3.44772 17 3 16.5523 3 16H1C1 17.6569 2.34315 19 4 19V17ZM13 17H4V19H13V17ZM14 16C14 16.5523 13.5523 17 13 17V19C14.6569 19 16 17.6569 16 16H14ZM13 15C13.5523 15 14 15.4477 14 16H16C16 14.3431 14.6569 13 13 13V15ZM4 15H13V13H4V15ZM16 4.5H19.75V2.5H16V4.5ZM19.75 4.5C19.8163 4.5 19.8799 4.52634 19.9268 4.57322L21.341 3.15901C20.919 2.73705 20.3467 2.5 19.75 2.5V4.5ZM19.9268 4.57322C19.9737 4.62011 20 4.68369 20 4.75H22C22 4.15327 21.7629 3.58097 21.341 3.15901L19.9268 4.57322ZM20 4.75V18.5H22V4.75H20ZM20 18.5C20 18.8978 19.842 19.2794 19.5607 19.5607L20.9749 20.9749C21.6313 20.3185 22 19.4283 22 18.5H20ZM19.5607 19.5607C19.2794 19.842 18.8978 20 18.5 20V22C19.4283 22 20.3185 21.6313 20.9749 20.9749L19.5607 19.5607ZM17 18.5V2.25H15V18.5H17Z" fill="#F8F8F8"/>
						</svg>
					</div>
					<div className="flex justify-end">
						New Delfruit Redesign!
					</div>
				</div>
				<div className="flex overflow-auto bg-[#F9F9F9] font-medium text-[#232123] group-hover:text-[#D63636] rounded-b-lg p-5 h-52 max-h-52 w-full">
					<div className="flex-auto justify-start">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi a venenatis pellentesque. Maecenas elementum in metus ut placerat. Integer eget porttitor ante. 
						Suspendisse ac arcu laoreet, sollicitudin dolor eu, dignissim libero.
						<div className="flex justify-end cursor-pointer">
							<DotsHorizontalIcon width={30} height={30} />
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-row space-x-5 absolute justify-center top-[23.5rem]">
				<div className="cursor-pointer w-[15px] h-[15px] rounded-full bg-[#D63636]"/>
				<div className="cursor-pointer w-[15px] h-[15px] rounded-full bg-[#F9F9F9]"/>
				<div className="cursor-pointer w-[15px] h-[15px] rounded-full bg-[#F9F9F9]"/>
				<div className="cursor-pointer w-[15px] h-[15px] rounded-full bg-[#F9F9F9]"/>
				<div className="cursor-pointer w-[15px] h-[15px] rounded-full bg-[#F9F9F9]"/>
			</div>
			<div className="flex rounded-full bg-[#B1B1B1] border-[#E4E4E4] border-2 bg-opacity-20 border-opacity-50 hover:bg-[#D63636] hover:bg-opacity-50 w-[60px] h-[60px] cursor-pointer items-center justify-center group">
				<svg width="13" height="19" viewBox="0 0 13 19" xmlns="http://www.w3.org/2000/svg" fill="#E4E4E4">
					<path d="M12.0531 9.6073L3.21353 18.4469L0.2677 15.499L6.16145 9.6073L0.2677 3.71563L3.21353 0.767712L12.0531 9.6073Z"/>
				</svg>
			</div>
		</nav>
	);
}

export default HomeNews;