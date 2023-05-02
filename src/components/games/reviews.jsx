import Image from "next/image";
import { EmojiIcon } from "../icons";
import Picker from '@emoji-mart/react';
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { forEach } from "lodash";

function clamp(num, min, max) {
    return num <= min
        ? min
        : num >= max
            ? max
            : num
}

function getElementOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
    };
}

function getElementHeight(el, type) {
    if (type === 'inner') // .innerHeight()
        return el.clientHeight;
    else if (type === 'outer') // .outerHeight()
        return el.offsetHeight;
    let s = window.getComputedStyle(el, null);
    if (type === 'width') // .height()
        return el.clientHeight - parseInt(s.getPropertyValue('padding-left')) - parseInt(s.getPropertyValue('padding-right'));
    else if (type === 'full') // .outerHeight(includeMargins = true)
        return el.offsetHeight + parseInt(s.getPropertyValue('margin-left')) + parseInt(s.getPropertyValue('margin-right'));
    return null;
}

function setElementClasses(el, classes) {
    forEach(classes, (className) => {
        el.classList.add(className);
    });
}

function removeElementClasses(el, classes) {
    forEach(classes, (className) => {
        el.classList.remove(className);
    });
}

export default function GameReviews({ count }) {
    const EMOJI_DATA_URL = "https://cdn.jsdelivr.net/npm/@emoji-mart/data@1.1.2";
    const [emojiData, setEmojiData] = useState(null);

    const increaseWritingArea = async (evOnInput) => {
        const self = evOnInput.target;
        self.style.height = "";
        //HACK: adding 4 to the scrollHeight is just large enough to disable the vertical scrollbar
        self.style.height = (self.scrollHeight + 4).toString() + "px";
    };

    const adjustEmojis = async (_) => {
        const target = document.getElementById("emoji-picker-container");
        //const topPos = getElementOffset(target).top - 10;
        //const height = getElementHeight(target, "outer");
        const minPos = getElementOffset(target.parentElement).top;
        //const maxPos = getElementHeight(target.parentElement, "outer");
        const maxPos = 3440; //HACK: yep, it's hardcoded, sue me
        //HACK: if one day sticky elements finally move more than half way, then remove this line
        //const absPos = minPos + maxPos - height;
        //const stickyClasses = ["sticky", "bottom-2.5", "right-2.5"];
        //const absClasses = ["fixed", "top-2.5", "right-[18px]", "m-0"];

        target.style.top = clamp(window.scrollY, minPos, maxPos) + 'px';
    };

    const toggleEmojis = async (_) => {
        const target = document.getElementById("emoji-picker-container");
        target.classList.toggle("hidden");
    }

    useEffect(() => {
        axios.get(EMOJI_DATA_URL).then((resp) => { setEmojiData(resp.data) });

        document.addEventListener("scroll", adjustEmojis);

    }, [EMOJI_DATA_URL]);

    return (
        <nav className="text-[#232123] bg-[#F9F9F9]">
            <div className="relative flex-col mx-40 my-10">
                <h2 className="absolute top-0 left-0 text-header font-medium mb-4">REVIEWS</h2>
                <div className="absolute top-3 right-0 text-xl">
                    <a>{count} total</a>
                </div>
                <hr className="relative top-10" />
            </div>
            <div className="flex my-20 mx-40 font-medium text-2xl space-x-5">
                <h2 className="flex">Sort By:</h2>
                <select id="sort" className="flex py-0 font-medium text-2xl justify-start rounded-md border-t-2 border-x-2 border-b-4 border-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636] bg-[#F9F9F9] text-[#BBBBBB]" defaultValue="Best">
                    <option value="Best">Best</option>
                    <option value="Recent">Recent</option>
                </select>
            </div>
            <div className="flex my-10 justify-center items-center">
                <Image className="cursor-pointer w-[70px] h-[70px] rounded-full border border-[#232123]" />
                <hr className="mr-6" />
                <div className="relative">
                    <textarea className="w-[784px] min-h-[140px] box-border bg-[#F9F9F9] border-2 rounded-[10px] border-solid border-[#232123] flex-none resize-none" placeholder="Share us your thoughts about the game!" onInput={increaseWritingArea} />
                    <div className="absolute bottom-0 w-full h-[30px] border bg-[#232123] border-[#232123] rounded-b-[10px] flex flex-row items-center pl-[24px] pr-[24px]">
                        <button className="pr-[inherit]" onClick={toggleEmojis}> <EmojiIcon color="#F8F8F8" /> </button>
                        <hr className="h-4/5 w-px bg-[#EAEAEA] opacity-20" />
                        <button className="pl-[inherit] pr-[inherit] not-italic font-bold text-2xl leading-9 flex items-center text-center text-uppercase text-[#F9F9F9]">B</button>
                    </div>
                </div>
                <div id="emoji-picker-container" className="hidden pl-[24px] float-right absolute bottom-2.5 right-2.5 flex">
                    {emojiData ? <Picker data={emojiData} emojiVersion={14} /> : <span>emojis loading</span>}
                </div>
            </div>
        </nav>
    );
}

