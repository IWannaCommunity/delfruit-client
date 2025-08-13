import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import GamePreview from "./GamePreview";

const HotPicks = () => {
    return (
        <nav className="bg-[#9FBD63] text-[#F9F9F9] flex flex-col h-[28rem]">
            <div className="mx-32 my-10">
                <h2 className="text-header font-medium text-[#F9F9F9]">HOT PICKS</h2>
                <hr />
            </div>
            <div className="flex justify-center items-center space-x-8">
                <div className="flex justify-center items-center rounded-full bg-[#F9F9F9] hover:bg-[#232123] w-[60px] h-[60px] cursor-pointer group">
                    <svg className="group-hover:fill-[#F9F9F9]" width="12" height="18" viewBox="0 0 12 18" fill="#232123" xmlns="http://www.w3.org/2000/svg">
                        <path d="M-1.56452e-05 8.83958L8.83957 -1.28766e-07L11.7854 2.94792L5.89165 8.83958L11.7854 14.7313L8.83957 17.6792L-1.56452e-05 8.83958Z" />
                    </svg>
                </div>
                <GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="374" h="198" link="/games" />
                <GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="374" h="198" link="/games" />
                <GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="374" h="198" link="/games" />
                <GamePreview title='I wanna be the Blank' image="/images/Game_without_screenshots.png" w="374" h="198" link="/games" />
                <div className="flex justify-center items-center rounded-full bg-[#F9F9F9] hover:bg-[#232123] w-[60px] h-[60px] cursor-pointer group">
                    <svg className="group-hover:fill-[#F9F9F9]" width="12" height="18" viewBox="0 0 12 18" fill="#232123" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9.16042L3.16043 18L0.214599 15.0521L6.10835 9.16042L0.214599 3.26875L3.16043 0.320831L12 9.16042Z" />
                    </svg>
                </div>
            </div>
        </nav>
    );
}

export default HotPicks;
