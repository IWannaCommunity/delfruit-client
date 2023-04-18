import React, { useEffect, useState } from 'react';
import Image from "next/image";
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars, ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin } from 'overlayscrollbars';

//NOTE: hard design limit
const MAX_DISPLAY = 3;

function CarouselSelectorArrow({ visible }) {
    let cssClass = "relative w-[40px] h-[24px] left-[calc(50%-53px/2+0.5px)] -top-[152px] z-0";
    if (visible === "none") {
        cssClass += " transition ease-in-out -translate-y-[24px] duration-280 transform-gpu";
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

    useEffect(() => {
        OverlayScrollbars.plugin([ScrollbarsHidingPlugin, SizeObserverPlugin, ClickScrollPlugin]);
        const osInst = OverlayScrollbars(document.querySelector("#carousel-container"), {
            overflow: { y: "hidden" },
            scrollbars: {
                clickScroll: true,
                theme: "os-df-carousel"
            }
        });
    }, []);


    const changeDisplay = async (self) => {
        // QUEST: vdom thrashing?
        const src = self.target.getAttribute("src");
        const elem = document.getElementById(displayElemId);
        elem.setAttribute("srcset", src);

        setIndex(self.target.getAttribute("idx"));
    }

    return (
        <div id="carousel-container" className="relative m-auto pt-10 justify-center items-center flex-shrink-0 flex-row gap-5 overflow-x-scroll overflow-y-hidden whitespace-nowrap w-[660px] h-[244px] carousel-scrollbar os-carousel">
            {/*HACK: invokes a shallow copy, but it doesn't look like JS has proper ranges? */}
            {
                photos.map((url, idx) => {
                    let cssClass = "!relative rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)] !z-1";
                    let arrowVisible = "hidden";
                    if (idx == index) {
                        cssClass = "transition-[border] rounded-[10px] border-2 border-[#232123]";
                        arrowVisible = "none";
                    }
                    return (<div className="w-[222px] h-[154px] inline-block float-none mx-[0.25%]"><Image className={cssClass} width={203} height={154} src={url} onClick={changeDisplay} idx={idx + windowStart} />
                        <CarouselSelectorArrow visible={arrowVisible} /></div>
                    )
                })
            }
        </div>
    );
}
