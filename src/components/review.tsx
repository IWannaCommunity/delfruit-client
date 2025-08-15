import Whitespace from "./whitespace";

export default function Review(): JSX.Element {
	return (
		<div className="review owner-review">
			<a href="/">TTBB</a>
			<Whitespace />
			<span className="!font-bold">[Creator]</span>
			<br/>
			<span> For: </span>
			<a href="/">I wanna be the Blank</a>
			<br/>
			<div className="review-text !wrap-break-word">
				<span>This is the best game ever!!!</span>
			</div>
			<div className="!mb-[0px]">
				<span> Tagged as: </span>
				<a className="tag" href="/">Avoidance</a>
				<Whitespace/>
				<a className="tag" href="/">Needle</a>
			</div>
			<span> [</span>
			<span className="r-like-span">0</span>
			<span>] </span>
			<span className="r-like-span-label">Likes</span>
			<div className="!m-[0px]">
				<span className="!align-middle">Rating: 10.0</span>
				<Whitespace />
				<span title="10.0" className="hearts">
					<span className="!w-[170px]"></span>
				</span>
				<span> &nbsp; &nbsp; &nbsp; </span>
				<span className="!align-middle">Difficulty: 40</span>
				<span title="40" className="stars">
					<span className="!w-[70px]"></span>
				</span>
				<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right"> Aug 13, 2025 </div>
			</div>
		</div>
	);
}