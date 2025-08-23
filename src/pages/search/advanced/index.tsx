import Header from "@/components/header";
import Whitespace from "@/components/whitespace";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import * as $ from "jquery";
import jQuery from "jquery";

export default function AdvancedSearch(): NextPage {
	const [rating, setRatingRange] = useState<[number, number]>([0, 10]);
	const [difficulty, setDifficultyRange] = useState<[number, number]>([0, 100]);

	useEffect(() => {
		const datepicker = require("jquery-ui/ui/widgets/datepicker");
		const slider = require("jquery-ui/ui/widgets/slider");
		const slider_css = require("jquery-ui/themes/base/all.css");
		$("#rating").slider({
			min: 0,
			max: 10,
			values: ["0", "10"],
			step: 1,
			range: true,
			disabled: false,
			change: (evt, ui) => {
				setRatingRange([ui.values[0], ui.values[1]]);
			},
			slide: (evt, ui) => {
				setRatingRange([ui.values[0], ui.values[1]]);
			},
		});

		$("#difficulty").slider({
			min: 0,
			max: 100,
			values: ["0", "100"],
			step: 1,
			range: true,
			disabled: false,
			change: (evt, ui) => {
				setRatingRange([ui.values[0], ui.values[1]]);
			},
			slide: (evt, ui) => {
				setRatingRange([ui.values[0], ui.values[1]]);
			},
		});
	}, []);

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Advanced Search</h2>
					<form className="pure-form pure-form-aligned">
						<fieldset>
							<div className="pure-control-group">
								<label htmlFor="title">Game Title:</label>
								<Whitespace />
								<input
									className="pure-input-1-3"
									id="title"
									type="text"
									placeholder="I wanna be the Guy Remastered"
									name="title"
									value=""
								/>
							</div>

							<div className="pure-control-group">
								<label htmlFor="author">Game Author:</label>
								<Whitespace />
								<input
									className="pure-input-1-3"
									id="author"
									type="text"
									placeholder="Cherry Treehouse"
									name="author"
									value=""
								/>
							</div>

							<label htmlFor="clear-any">
								<input
									className="pure-input-1-3"
									id="dorate"
									type="checkbox"
									name="rated"
								/>{" "}
								Specify Rating
							</label>
							<div>
								Rating: <span id="ratingSpan" />
							</div>
							<div className="p-0 ml-2 mr-2 mb-4" id="rating" />

							<label htmlFor="clear-any">
								<input
									className="pure-input-1-3"
									id="dodiff"
									type="checkbox"
									name="diffd"
								/>{" "}
								Specify Difficulty
							</label>
							<div>
								Difficulty: <span id="diffSpan" />
							</div>
							<div className="p-0 ml-2 mr-2" id="difficulty" />
							<br />

							<div className="pure-control-group">
								<label htmlFor="tags">Tags (separate with spaces): </label>
								<input
									className="pure-input-1-3"
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
										<input
											className="pure-input-1-3"
											id="clear-any"
											type="radio"
											name="clear"
											value=""
										/>{" "}
										Any
									</label>
									<label htmlFor="clear-uncleared">
										<input
											className="pure-input-1-3"
											id="clear-uncleared"
											type="radio"
											name="clear"
											value="0"
										/>{" "}
										Not Cleared
									</label>
									<label htmlFor="clear-cleared">
										<input
											className="pure-input-1-3"
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
											className="pure-input-1-3"
											id="review-any"
											type="radio"
											name="ireviewed"
											value=""
										/>{" "}
										Any
									</label>
									<label htmlFor="review-no">
										<input
											className="pure-input-1-3"
											id="review-no"
											type="radio"
											name="ireviewed"
											value="0"
										/>{" "}
										Not Reviewed
									</label>
									<label htmlFor="review-yes">
										<input
											className="pure-input-1-3"
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
								<div className="pure-control-group">
									<label htmlFor="dl">Require Download Link:</label>
									<label htmlFor="dl">
										<input
											className="pure-input-1-3"
											id="dl"
											type="radio"
											name="dl"
											value="0"
										/>{" "}
										Either
										<input
											className="pure-input-1-3"
											id="dl"
											type="radio"
											name="dl"
											value="1"
										/>{" "}
										Yes
										<input
											className="pure-input-1-3"
											id="dl"
											type="radio"
											name="dl"
											value="-1"
										/>{" "}
										No
									</label>
								</div>
								{/* #endregion */}

								{/* #region Release Window */}
								<div className="pure-control-group">
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

								<div className="pure-control-group">
									<button
										type="submit"
										className="pure-button pure-button-primary"
									>
										Search
									</button>
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
