import Header from "@/components/header";
import Whitespace from "@/components/whitespace";
import type { AnyElem } from "@/utils/element";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function AdvancedSearch(): AnyElem {
	const router = useRouter();

	const [specifiedRating, toggleSpecifiedRating] = useState<boolean>(false);
	const [ratingRange, setRatingRange] = useState<[number, number]>([0, 100]);
	const [specifiedDifficulty, toggleSpecifiedDifficulty] =
		useState<boolean>(false);
	const [difficultyRange, setDifficultyRange] = useState<[number, number]>([
		0, 100,
	]);
	const [requireDL, setRequireDL] = useState<number | 0 | 1 | -1 | undefined>(
		undefined,
	);
	const [createdFrom, setCreatedFrom] = useState<string, undefined>(undefined);
	const [createdTo, setCreatedTo] = useState<string, undefined>(undefined);

	const uiSetRatingRange = useDebouncedCallback((value) => {
		setRatingRange(value);
	}, 10);
	const uiSetDifficultyRange = useDebouncedCallback((value) => {
		setDifficultyRange(value);
	}, 10);
	const uiSetCreatedFrom = useDebouncedCallback((value) => {
		setCreatedFrom(value);
	}, 10);
	const uiSetCreatedTo = useDebouncedCallback((value) => {
		setCreatedTo(value);
	}, 10);

	useEffect(() => {
		require("jquery");
		require("jquery-ui/ui/widgets/datepicker");
		require("jquery-ui/ui/widgets/slider");
	}, []);

	useEffect(() => {
		$.uiBackCompat = false;

		$("#rating").slider({
			min: 0,
			max: 100,
			values: ratingRange,
			step: 1,
			range: true,
			disabled: !specifiedRating,
			change: (evt, ui) => {
				uiSetRatingRange([ui.values[0], ui.values[1]]);
			},
			slide: (evt, ui) => {
				uiSetRatingRange([ui.values[0], ui.values[1]]);
			},
		});

		$("#difficulty").slider({
			min: 0,
			max: 100,
			values: difficultyRange,
			step: 1,
			range: true,
			disabled: !specifiedDifficulty,
			change: (evt, ui) => {
				uiSetDifficultyRange([ui.values[0], ui.values[1]]);
			},
			slide: (evt, ui) => {
				uiSetDifficultyRange([ui.values[0], ui.values[1]]);
			},
		});

		$("#from").datepicker({
			defaultDate: "-0d",
			changeMonth: true,
			numberOfMonths: 3,
			dateFormat: "yy-mm-dd",
			onClose: (selectedDate) => {
				$("#from").datepicker("option", "maxDate", selectedDate);
				uiSetCreatedFrom(selectedDate);
			},
		});

		$("#to").datepicker({
			defaultDate: "-0d",
			changeMonth: true,
			numberOfMonths: 3,
			dateFormat: "yy-mm-dd",
			onClose: (selectedDate) => {
				$("#to").datepicker("option", "maxDate", selectedDate);
				uiSetCreatedTo(selectedDate);
			},
		});
	}, [
		ratingRange,
		difficultyRange,
		specifiedRating,
		specifiedDifficulty,
		uiSetRatingRange,
		uiSetDifficultyRange,
		uiSetCreatedFrom,
		uiSetCreatedTo,
	]);

	async function startSearch(evt: React.FormEvent<HTMLFormElement>) {
		evt.preventDefault();

		const searchParams = new URLSearchParams();
		// TODO: set these all at once
		specifiedRating && searchParams.set("ratingFrom", String(ratingRange[0]));
		specifiedRating && searchParams.set("ratingTo", String(ratingRange[1]));
		specifiedDifficulty &&
			searchParams.set("difficultyFrom", String(difficultyRange[0]));
		specifiedDifficulty &&
			searchParams.set("difficultyTo", String(difficultyRange[1]));
		requireDL && searchParams.set("hasDownload", String(requireDL));
		createdFrom && searchParams.set("createdFrom", createdFrom);
		createdTo && searchParams.set("createdTo", createdTo);

		router.push(`/search?${searchParams}`);
	}

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Advanced Search</h2>
					<form onSubmit={startSearch}>
						<fieldset>
							<div>
								<label htmlFor="title">Game Title:</label>
								<Whitespace />
								<input
									id="title"
									type="text"
									placeholder="I wanna be the Guy Remastered"
									name="title"
									defaultValue=""
								/>
							</div>

							<div>
								<label htmlFor="author">Game Author:</label>
								<Whitespace />
								<input
									id="author"
									type="text"
									placeholder="Cherry Treehouse"
									name="author"
									defaultValue=""
								/>
							</div>

							<label htmlFor="clear-any">
								<input
									id="dorate"
									type="checkbox"
									name="rated"
									onChange={async (evt) => {
										toggleSpecifiedRating(evt.currentTarget.checked);
									}}
								/>{" "}
								Specify Rating
							</label>
							<div>
								Rating:{" "}
								{!specifiedRating ? (
									"Any"
								) : (
									<>
										{ratingRange[0] / 10} - {ratingRange[1] / 10}
									</>
								)}
								<span id="ratingSpan" />
							</div>
							<div className="p-0 ml-2 mr-2 mb-4" id="rating" />

							<label htmlFor="clear-any">
								<input
									id="dodiff"
									type="checkbox"
									name="diffd"
									onChange={async (evt) => {
										toggleSpecifiedDifficulty(evt.currentTarget.checked);
									}}
								/>{" "}
								Specify Difficulty
							</label>
							<div>
								Difficulty:{" "}
								{!specifiedDifficulty ? (
									"Any"
								) : (
									<>
										{difficultyRange[0]} - {difficultyRange[1]}
									</>
								)}
								<span id="diffSpan" />
							</div>
							<div className="p-0 ml-2 mr-2" id="difficulty" />
							<br />

							<div>
								<label htmlFor="tags">Tags (separate with spaces): </label>
								<input
									id="tags"
									type="text"
									placeholder="Needle Avoidance"
									name="tags"
									value=""
								/>

								<input type="radio" id="include" name="t_inc" value="include" />
								<label htmlFor="include">Include</label>
								<input type="radio" id="exclude" name="t_inc" value="exclude" />
								<label htmlFor="exclude">Exclude</label>

								<br />
								<button type="button" id="show-tags" className="mb-[5px]">
									Show Existing Tags
								</button>
								<button
									type="button"
									id="hide-tags"
									className="mb-[5px] hidden"
								>
									Hide Tags
								</button>
								<div id="tags-list" className="py-0 px-[5px] hidden" />

								{/* #region Session Based */}
								{/* Clear */}
								<div>
									Cleared by me?
									<br />
									<label htmlFor="clear-any">
										<input id="clear-any" type="radio" name="clear" value="" />{" "}
										Any
									</label>
									<label htmlFor="clear-uncleared">
										<input
											id="clear-uncleared"
											type="radio"
											name="clear"
											value="0"
										/>{" "}
										Not Cleared
									</label>
									<label htmlFor="clear-cleared">
										<input
											id="clear-cleared"
											type="radio"
											name="clear"
											value="1"
										/>{" "}
										Cleared
									</label>
								</div>
								{/* Reviewed */}
								<div>
									Reviewed by me?
									<br />
									<label htmlFor="review-any">
										<input
											id="review-any"
											type="radio"
											name="ireviewed"
											value=""
										/>{" "}
										Any
									</label>
									<label htmlFor="review-no">
										<input
											id="review-no"
											type="radio"
											name="ireviewed"
											value="0"
										/>{" "}
										Not Reviewed
									</label>
									<label htmlFor="review-yes">
										<input
											id="review-yes"
											type="radio"
											name="ireviewed"
											value="1"
										/>{" "}
										Reviewed
									</label>
								</div>
								{/* #endregion */}

								{/* #region Download */}
								<div>
									<label htmlFor="dl">Require Download Link:</label>
									<label htmlFor="dl">
										<input
											id="dl"
											type="radio"
											name="dl"
											value="0"
											onChange={async () => {
												setRequireDL(0);
											}}
										/>{" "}
										Either
										<input
											id="dl"
											type="radio"
											name="dl"
											value="1"
											onChange={async () => {
												setRequireDL(1);
											}}
										/>{" "}
										Yes
										<input
											id="dl"
											type="radio"
											name="dl"
											value="-1"
											onChange={async () => {
												setRequireDL(-1);
											}}
										/>{" "}
										No
									</label>
								</div>
								{/* #endregion */}

								{/* #region Release Window */}
								<div>
									Released between
									<br />
									<label htmlFor="from">From</label>
									<Whitespace />
									<input type="text" id="from" name="from" />
									<Whitespace />
									<label htmlFor="to">To</label>
									<Whitespace />
									<input type="text" id="to" name="to" />
								</div>
								{/* #endregion */}

								<div>
									<button type="submit">Search</button>
									<Whitespace />
									<input type="button" id="lucky" value="I'm feeling lucky!" />
									<input type="hidden" name="advanced" value="1" />
								</div>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	);
}
