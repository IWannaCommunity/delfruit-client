import React, { useState } from 'react';
import Image from "next/image";

const MAX_DISPLAY = 3;

function changeDisplay() {
    const src = self.getAttribute("src");
    const elem = document.getElementById("displayCurScrnshot");
    elem.setAttribute("src", src);
}

export function Carousel({ photoUrls, displayElemId }) {
    const [index, setIndex] = useState(0);
    const [photos, setPhotos] = useState(photoUrls);
    var [windowStart, setWindowStart] = useState(0);

    return (
        <div className="relative m-auto pt-10 justify-center items-center flex flex-row gap-5">
            {/*HACK: invokes a shallow copy, but it doesn't look like JS has proper ranges? */}
            {photos.slice(windowStart, windowStart + MAX_DISPLAY).map((url, idx) => (
                <Image className="rounded-lg drop-shadow-[0_10px_8px_rgba(0,0,0,0.50)]" width={203} height={154} src={url} onClick={(self) => {
                    // QUEST: vdom thrashing?
                    const src = self.target.getAttribute("src");
                    const elem = document.getElementById(displayElemId);
                    elem.setAttribute("srcset", src);
                }} />
            ))}
        </div>
    );
}
