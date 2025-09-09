import Link from "next/link";

export default function SubmittingRules(): JSX.Element {
	return(
		<>
			<h3>Submitting Games</h3>
			<ul>
				<li>
					<span>Game submissions should be done through the </span>
					<a href="https://www.iwannawiki.com/games/create">I Wanna Wiki</a>
				</li>
				<li>
					Games that are added to the wiki that are not yet on delfruit 
					are in the process of being added or not added for a reason.
				</li>
				<li>
					<span className="mr-1">
						Submission of games that are not listed on delfruit can be 
						submitted through the
					</span>
					<Link href="/">Delicious Fruit Submission Page</Link>
					. Do not request for a download link to be added, that is a 
					right reserved to the creators themself and should be done 
					through the wiki.
				</li>
				<li>
					Games that are found to be untrustworthy will be removed and/or 
					not added in the first place without proof of trustworthiness.
				</li>
			</ul>
		</>
	);
}