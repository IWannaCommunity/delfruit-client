import { AnyElem } from "@/utils/element";
import Image from "next/image";

export default function UploadScreenshot(): AnyElem {
	return (
		<>
			<h1>Screenshot Upload</h1>
			<h2>I wanna be the test</h2>
			<form>
				<div>
					<Image src="/images/noimage.png" alt="" width={200} height={150}/>
				</div>
				<hr/>
				<div>
					<span> Description: (100 character max)</span>
					<br/>
					<input className="w-full" type="text"/>
					<span>0 / 100 characters</span>
				</div>
				<div>
					<div>
						<p>
							Select an image to upload: (max filesize: 1MB, max image size: 1024x768, JPG/PNG only)
						</p>
						<input type="file"/>
						<br/>
						<input type="submit" value="Upload"/>
						<input type="hidden" value="45712"/>
						<br/>
					</div>
					<div className="hidden"/>
					<p className="mb-0">
						The best screenshots include the title screen & a couple of
						representative screens from the game.
						<br/>
						<span className="font-bold">Please,</span>
					</p>
					<ul className="mt-0">
						<li>Do not upload clear screenshots</li>
						<li>
							Do not upload spoilers (secrets, clear screens, etc...)
							will be removed if found to be significant.
						</li>
						<li>
							When taking a screenshot to upload, please consider using the ingame
							screenshot button (F9 by default). If it doesn't exist, please include
							a screenshot of the game itself and not include the window border.
						</li>
						<li>
							If a screenshot for the game doesn't exist,
							consider uploading a screenshot of the title screen.
						</li>
						<li>Do not submit too many similar screenshots</li>
						<li>Do not upload a screenshot of glitches or bugs that the game might contant.</li>
					</ul>
					<p>
						<span>By uploading a screenshot, you release your work under the </span>
						<a href="http://creativecommons.org/licenses/by-sa/3.0/">
							Creative Commons by-sa 3.0 license.
						</a>
					</p>
					<p className="text-[0.85em]">
						<span>'No image' Icon made by </span>
						<a href="https://www.flaticon.com/authors/daniel-bruce">
							Daniel Bruce
						</a>
						<span> from </span>
						<a href="www.flaticon.com">
							www.flaticon.com
						</a>
					</p>
				</div>
			</form>
			<h4 className="hidden">Loading...</h4>
		</>
	);
}