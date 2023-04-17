import Image from "next/image";
import { UploadIcon } from "@heroicons/react/outline";
import Rating from "./rating";
import Difficulty from "./difficulty";
import { DownloadIcon, ShareIcon, SaveIcon } from "../icons";

const GameDetails = ({ title, date, creator, rating, difficulty }) => {
    return (
        <nav className="text-[#232123] bg-[#F9F9F9]">
            <div className="relative flex-col mx-40 my-10">
                <h2 className="absolute top-0 left-0 text-header font-medium mb-4">{title}</h2>
                <div className="absolute top-3 right-0 flex-row space-x-5 text-xl">
                    <a>{date}</a>
                    <a>By: <a className="text-[#D63636]">{creator}</a></a>
                </div>
                <hr className="relative top-10" />
                <div className="mt-20 grid grid-cols-2">
                    <Image className="mx-auto rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/ShowcasedImage-Test.png" width={650} height={494} />
                    <div className="border w-[86%] h-[139%] rounded-lg bg-[#F9F9F9] drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)] flex flex-col">
                        <h2 className="mt-5 mx-5 text-2xl font-medium">Rating:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mt-5 mx-5 flex flex-row">
                            <Rating value={rating} className="flex justify-start space-x-2" />
                            <div className="absolute right-0 mx-10">
                                <a className="text-xl">{rating}%</a>
                            </div>
                        </div>
                        <h2 className="mt-10 mx-5 text-2xl font-medium">Difficulty:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mt-5 mx-5 flex flex-row">
                            <Difficulty value={difficulty} className="flex justify-start space-x-2" />
                            <div className="absolute right-0 mx-10">
                                <a className="text-xl">{difficulty}%</a>
                            </div>
                        </div>
                        <h2 className="mt-10 mx-5 text-2xl font-medium">Tags:</h2>
                        <hr className="mt-2 mx-5" />
                        <div className="mx-5 my-10 absolute bottom-0 flex flex-row gap-4">
                            <div className="flex justify-center items-center rounded-lg bg-[#232123] border h-[50px] w-[300px] cursor-pointer hover:bg-[#D63636] gap-3">
                                <DownloadIcon /> <a className="text-[#F9F9F9] text-2xl font-medium">Download</a>
                            </div>
                            <div className="flex justify-center items-center rounded-lg bg-[#F9F9F9] border-2 border-[#232123] h-[50px] w-[147px] cursor-pointer hover:bg-[#4F89E1] hover:border-[#4F89E1] group gap-3">

                                <ShareIcon /> <a className="text-[#232123] text-2xl font-medium group-hover:text-[#F9F9F9]">Share</a>
                            </div>
                            <div className="flex justify-center items-center rounded-lg bg-[#F9F9F9] border-2 border-[#232123] h-[50px] w-[147px] cursor-pointer hover:bg-[#1EB475] hover:border-[#1EB475] group gap-3">
                                <SaveIcon /> <a className="text-[#232123] text-2xl font-medium group-hover:text-[#F9F9F9]">Save</a>
                            </div>
                        </div>
                    </div>
                    <div className="relative m-auto pt-10 justify-center items-center flex flex-row gap-5">
                        <Image className="rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/ShowcasedImage-Test.png" width={203} height={154} />
                        <Image className="rounded-lg hover:border-[#F9F9F9] hover:border-4 hover:drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/screenshot2.png" width={203} height={154} />
                        <Image className="rounded-lg hover:border-[#F9F9F9] hover:border-4 hover:drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" src="/images/screenshot3.png" width={203} height={154} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default GameDetails;
