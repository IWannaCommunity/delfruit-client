import Image from "next/image";
import Whitespace from "../whitespace";

export default function GameInfo(): JSX.Element {
	return (
		<div className="!w-[50%] !float-left">
			<h1 className="!wrap-break-word">I wanna be the Blank </h1>
			<h2 id="creator-label" className="!mb-[13px]"> 
				Creator: <a href="/">TTBB</a>
			</h2>
			<div className="!w-[380px] !m-auto !h-[80px]">
				<div className="rating !bg-[#a7d780]">
					<span>Average Rating</span>
					<div>
						<span id="avgRating"> 6.8 / 10 </span>
						<br/>
						<span className="description" id="avgRatingLabel">Good</span>
					</div>
				</div>
				<div className="rating !bg-[#d480aa]">
					<span>Average Difficulty</span>
					<div>
						<span id="avgDifficulty">66.0 / 10 </span>
						<br/>
						<span className="description" id="avgDiffLabel">Good</span>
					</div>
				</div>
			</div>
			<a target="_blank" className="standalone" id="game-link" href="/">
				<Image src="/images/download.png" className="!absolute !ml-[2px]" width={14} height={14} alt="Write Review" />
				<span> &nbsp;&nbsp;&nbsp;&nbsp; Download Game</span>
			</a>
			<span id="no-link" className="!inline-block !pb-[1em] !hidden">[Download Not Available]</span>
			<br/>
			<a className="standalone" href="/">
				<Image src="/images/camera.png" className="!absolute !ml-[2px]" width={14} height={14} alt="Upload Screenshot" />
				<span> &nbsp;&nbsp;&nbsp;&nbsp; Upload a Screenshot	</span>
			</a>
			<br/>
			<a className="standalone" href="/">Report Game or Suggest Edit</a>
			<br/>
			<input type="checkbox" id="chk_favourite"/>
			<span>Favourite </span>
			<span className="favourite_alert !hidden"></span>
			<br/>
			<input type="checkbox" id="chk_clear"/>
			<span>Cleared </span>
			<span className="clear_alert !hidden"></span>
			<br/>
			<input type="checkbox" id="chk_bookmark"/>
			<span>Bookmark </span>
			<span className="bookmark_alert !hidden"></span>
			<p>0 people favourited this game!</p>
			<p> Date Submitted: Aug 14, 2025 </p>
			<div>
				<h2>Tags:</h2>
				<a href="/" className="tag">Needle (2)</a>
				<Whitespace />
				<a href="/" className="tag impossible-tag">Impossible (1)</a>
			</div>
		</div>
	);
}