import GamePreview from "./gamepreview";
import RangeSlider from "../MultiRangeSlider/RangeSlider";
import { useEffect, useState } from "react";
import { GamesApi } from "../../generated/swagger-codegen";
import { times } from "lodash";

const apiClient = new GamesApi(void 0, "http://localhost:4201");

function HomeGames() {
	const [games, setGames] = useState(null);
	const [page, setPage] = useState(0);

	useEffect(() => {
		const fetchGames = async () => {
			const req = await apiClient.getGames(
				void 0,
				void 0,
				false,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				void 0,
				page,
				12,
			);
			if (req.status !== 200) {
				return;
			}
			setGames(req.data);
		};

		fetchGames();
	}, [page]);

	return (
		<nav className="relative py-10 bg-[#F9F9F9]">
			<div className="mx-32">
				<h2 className="text-header font-medium text-[#232123]">FANGAMES</h2>
				<hr />
			</div>
			<div className="flex my-10 justify-center items-center font-medium text-2xl text-[#232123] space-x-5">
				<h2 className="flex">Sort By:</h2>
				<select
					id="sort"
					className="flex py-0 justify-start font-medium text-2xl rounded-md border-t-2 border-x-2 border-b-[5px] border-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636] bg-[#F9F9F9] text-[#BBBBBB]"
					defaultValue="TRENDING"
				>
					<option value="TRENDING">Trending</option>
					<option value="RECENT">Recent</option>
					<option value="LIKED">Most Liked</option>
					<option value="DIFFICULTY">Difficulty</option>
				</select>
				<h2 className="flex">Genre:</h2>
				<select
					id="genre"
					className="flex py-0 justify-start font-medium text-2xl rounded-md border-t-2 border-x-2 border-b-[5px] border-[#BBBBBB] bg-[#F9F9F9] text-[#BBBBBB] hover:border-[#D63636] hover:text-[#D63636]"
					defaultValue="ALL"
				>
					<option value="ALL">All</option>
					<option value="ADVENTURE">Adventure</option>
					<option value="AVOIDANCE">Avoidance</option>
					<option value="NEEDLE">Needle</option>
				</select>
				<h2 className="flex">Rating:</h2>
				<RangeSlider
					initialMin={0}
					initialMax={10000}
					min={0}
					max={10000}
					step={100}
					gap={0}
				/>
				<h2 className="flex">Difficulty:</h2>
				<RangeSlider
					initialMin={0}
					initialMax={100000}
					min={0}
					max={100000}
					step={100}
					gap={0}
				/>
			</div>
			<div className="flex-wrap px-10 xl:px-32 my-10 sm:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:flex justify-center items-center gap-10">
				{games?.map((game, idx) => {
					return (
						<GamePreview
							key={idx}
							title={game.name}
							idx={game.id}
							w="366"
							h="198"
							link={`/games/${game.id}`}
						/>
					);
				})}
			</div>
			<div className="flex justify-center space-x-3 pt-5">
				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[100px] h-[50px] cursor-pointer group">
					<svg
						className="group-hover:fill-[#F9F9F9]"
						width="13"
						height="18"
						viewBox="0 0 13 18"
						fill="#232123"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M0.946884 8.89281L9.78647 0.0532225L12.7323 3.00114L6.83855 8.89281L12.7323 14.7845L9.78647 17.7324L0.946884 8.89281Z" />
					</svg>
				</div>
				{times(5, (idx) => {
					const changePage = async () => {
						setPage(idx);
					};

					const unselectedClasses =
						"group-hover:text-[#F9F9F9] bg-[#F9F9F9] hover:bg-[#232123] border-[#232123]";
					const selectedClasses =
						"text-[#F9F9F9] bg-[#232123] border-[#232123]";

					const extraClasses = [];
					if (idx === page) {
						extraClasses.push(selectedClasses);
					} else {
						extraClasses.push(unselectedClasses);
					}
					const clsName = `flex justify-center items-center border-2 rounded-lg ${extraClasses[0]} w-[50px] h-[50px] cursor-pointer group`;
					return (
						<a className={clsName} onClick={changePage}>
							<div className="group-hover:text-[#F9F9F9] flex font-semibold text-2xl">
								{idx + 1}
							</div>
						</a>
					);
				})}

				<div className="flex justify-center items-center border-2 rounded-lg bg-[#F9F9F9] hover:bg-[#232123] border-[#232123] w-[100px] h-[50px] cursor-pointer group">
					<svg
						className="group-hover:fill-[#F9F9F9]"
						width="13"
						height="18"
						viewBox="0 0 13 18"
						fill="#232123"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M12.0531 9.10719L3.21353 17.9468L0.2677 14.9989L6.16145 9.10719L0.2677 3.21553L3.21353 0.267609L12.0531 9.10719Z" />
					</svg>
				</div>
			</div>
		</nav>
	);
}

export default HomeGames;
