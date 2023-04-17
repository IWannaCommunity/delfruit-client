import React, { useState } from 'react';
import Image from "next/image";

const MAX_DISPLAY = 3;

function CarouselSelectorArrow({ visible }) {
    let cssClass = "relative w-[40px] h-[24px] left-[calc(50%-40px/2+0.5px)] -top-[152px] z-0";
    if (visible === "none") {
        cssClass += " transition ease-in-out -translate-y-[24px] duration-30 transform-gpu";
    }
    return (
        <svg className={cssClass} visibility={visible} width="36" height="18" viewBox="0 0 36 18" fill="#232123" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0L35.3205 18H0.679491L18 0Z" />
        </svg>
    )
}

export function Carousel({ photoUrls, displayElemId }) {
    const [index, setIndex] = useState(0);
    const [photos, setPhotos] = useState(photoUrls);
    var [windowStart, setWindowStart] = useState(0);

    const changeDisplay = async (self) => {
        // QUEST: vdom thrashing?
        const src = self.target.getAttribute("src");
        const elem = document.getElementById(displayElemId);
        elem.setAttribute("srcset", src);

        setIndex(self.target.getAttribute("idx"));
    }

    return (
        <div className="relative m-auto pt-10 justify-center items-center flex flex-row gap-5">
            {/*HACK: invokes a shallow copy, but it doesn't look like JS has proper ranges? */}
            {
                photos.slice(windowStart, windowStart + MAX_DISPLAY).map((url, idx) => {
                    let cssClass = "!relative rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)] z-1";
                    let arrowVisible = "hidden";
                    if (idx == index) {
                        cssClass = "transition-[border] rounded-[10px] border-2 border-[#232123]";
                        arrowVisible = "none";
                    }
                    return (<div><Image className={cssClass} width={203} height={154} src={url} onClick={changeDisplay} idx={idx + windowStart} />
                        <CarouselSelectorArrow visible={arrowVisible} /></div>
                    )
                })
            }
        </div>
    );
}
