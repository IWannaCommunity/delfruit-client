import { FlagIcon, GiftIcon, PinIcon, ReplyIcon, ShareIcon, ShareReviewIcon, VoteIcon } from "../icons";
import Difficulty from "./difficulty";
import Rating from "./rating";

export default function UserComment({ name, badge, pinned, comment, votes, rating, difficulty }) {
    const pinnedElement = (
        <div className="flex flex-row justify-end items-center pl-0 pr-2 gap-2.5 w-[654px]">
            <p className="font-['Prompt'] non-italic font-normal text-base flex items-center text-center capitalize text-[#1EB475]">
                Pinned
            </p>
            <PinIcon color="#1EB475" />
        </div>
    );

    return (
        <div className="flex flex-col items-start p-0 gap-1 w-[802px] h-[124px] border rounded-[10px]">
            <div className="flex flex-row items-center p-0 gap-2.5 w-[802px] h-[30px]">
                <p className="font-['Prompt'] non-italic font-medium text-2xl flex items-center text-center"> {name} </p>
                {badge}
                {pinned ? pinnedElement : null}
            </div>
            <p className="font-['Prompt'] non-italic font-normal text-base flex items-center text-[#232123]">
                {comment}
            </p>
            <div className="flex flex-row items-baseline pl-1 gap-6 w-[802px] h-[30px]">
                <div className="flex flex-row items-center p-0 gap-2.5 h-[24px]">
                    <VoteIcon stroke="#232123" fill="none" />
                    <p className="font-['Prompt'] non-italic font-medium text-base flex items-center text-center text-[#232123] self-center">{votes ? votes : 1}</p>
                    <VoteIcon stroke="#232123" fill="none" className="rotate-180" />
                </div>
                <div className="flex flex-row items-center p-0 gap-1 h-[24px]">
                    <GiftIcon />
                    <p className="font-['Prompt'] non-italic font-medium text-base flex items-center text-center text-[#232123] self-center">Gift</p>
                </div>
                <div className="hidden flex flex-row items-center p-0 gap-1 h-[24px]">
                    <ShareReviewIcon />
                    <p className="font-['Prompt'] non-italic font-medium text-base flex items-center text-center text-[#232123] self-center">Share</p>
                </div>
                <div className="hidden flex flex-row items-center p-0 gap-1 h-[24px]">
                    <ReplyIcon />
                    <p className="font-['Prompt'] non-italic font-medium text-base flex items-center text-center text-[#232123] self-center">Reply</p>
                </div>
                <div className="flex flex-row justify-end items-baseline pl-0 pr-2 gap-2 w-[454px]">
                    <FlagIcon />
                </div>
            </div>
            <hr className="border border-solid border-[rgba(177,177,177,0.5)] w-[inherit]" />
            <div className="flex flex-row items-center p-0 gap-6 w-[inherit] h-[24px]">
                <div className="flex flex-row items-center p-0 gap-2 w-[auto] h-[inherit]">
                    <Rating value={rating} className="flex flex-row items-start p-0 gap-2 w-[inherit] h-[inherit] justify-start" />
                    <p className="font-['Prompt'] non-italic font-normal text-base flex items-center text-[#232123]">{rating}%</p>
                </div>

                <div className="flex flex-row items-center p-0 gap-2 w-[auto] h-[inherit]">
                    <Difficulty value={difficulty} className="flex flex-row items-start p-0 gap-2 w-[inherit] h-[inherit] justify-start" />
                    <p className="font-['Prompt'] non-italic font-normal text-base flex items-center text-[#232123]">{difficulty}%</p>
                </div>
            </div>
        </div>
    );
}
