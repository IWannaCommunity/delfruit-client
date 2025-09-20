export default function SuspensionRules(): JSX.Element {
	return(
		<>
			<h3>Suspension Rules</h3>
			<ul>
				<li>Violation of the bolded rules will result in a suspension</li>
				<li>Suspended reviewing permissions go for 3, 7, 30, 180 days.</li>
				<li>
					After a 180 day suspension and a user has to have another
					review removed they are then indefinitely removed.
				</li>
				<li>
					After 30 days of not having a review removed the suspended
					reviewing permission incremental increase is reset.
				</li>
				<li>
					Accounts intentionally evading a suspension will be indefinitely
					suspended without appeal.
				</li>
				<li>
					Targeted threats, harassment, or nonsensical and obscene reviews
					towards a game or creator will have your account indefinitely
					suspended without appeal.
				</li>
			</ul>
		</>
	);
}