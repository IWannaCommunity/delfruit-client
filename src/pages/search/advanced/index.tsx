import { isUndefined } from "lodash";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type React from "react";
import {
    type ChangeEvent,
    MouseEventHandler,
    useCallback,
    useEffect,
    useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import Header from "@/components/header";
import Whitespace from "@/components/whitespace";
import type { AnyElem } from "@/utils/element";
import { useSessionContext, useTimer } from "@/utils/hooks";
import { Game } from "delfruit-swagger-cg-sdk";
import { API } from "@/utils/api";

export default function AdvancedSearch(): AnyElem {
    const router = useRouter();
    const [session, _] = useSessionContext();

    const [title, setTitle] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    const [specifiedRating, toggleSpecifiedRating] = useState<boolean>(false);
    const [ratingRange, setRatingRange] = useState<[number, number]>([0, 100]);
    const [specifiedDifficulty, toggleSpecifiedDifficulty] =
        useState<boolean>(false);
    const [difficultyRange, setDifficultyRange] = useState<[number, number]>([0, 100]);

    const [tags, setTags] = useState<string>("");
    const [hasCleared, setHasCleared] = useState<boolean | undefined>(undefined);
    const [hasReviewed, setHasReviewed] = useState<boolean | undefined>(undefined);

    const [requireDL, setRequireDL] = useState<number | 0 | 1 | -1 | undefined>(undefined);
    const [createdFrom, setCreatedFrom] = useState<string | undefined>(undefined);
    const [createdTo, setCreatedTo] = useState<string | undefined>(undefined);

    const [loadedSaveFile, setLoadedSaveFile] = useState<boolean>(false);

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

    useEffect(() => {
        if ((!router.isReady) || (loadedSaveFile)) {
            return
        }

        // DANGER: STUPID, BUT I DON'T KNOW OF ANY OTHER WAY
        document.getElementById("title").value = router.query.name?.toString() ?? "";
        setTitle(router.query.name?.toString() ?? "")
        document.getElementById("author").value = router.query.author?.toString() ?? "";
        setAuthor(router.query.author?.toString() ?? "")
        setRatingRange([Number(router.query.ratingFrom ?? 0), Number(router.query.ratingTo ?? 100)]);
        if (Number(router.query.ratingFrom ?? 0) !== 0 || Number(router.query.ratingTo ?? 100) !== 100) {
            document.getElementById("dorate").checked = true;
            toggleSpecifiedRating(true);
        }
        setDifficultyRange([Number(router.query.difficultyFrom ?? 0), Number(router.query.difficultyTo ?? 100)]);
        if (Number(router.query.difficultyFrom ?? 0) !== 0 || Number(router.query.difficultyTo ?? 100) !== 100) {
            document.getElementById("dodiff").checked = true;
            toggleSpecifiedDifficulty(true);
        }
        document.getElementById("tags").value = router.query.tags?.toString() ?? "";
        setTags(router.query.tags?.toString() ?? "")
        setHasCleared(router.query.cleared ?? undefined)
		if (document.getElementById("clear-any") && typeof document.getElementById("clear-any") === "object") {
			if (router.query.cleared === undefined) {
				document.getElementById("clear-any").checked = true;
			} else if (router.query.cleared === true) {
				document.getElementById("clear-cleared").checked = true;
			} else {
				document.getElementById("clear-uncleared").checked = true;
			}
		}
        setHasReviewed(router.query.reviewed ?? undefined)
		if (document.getElementById("review-any") && typeof document.getElementById("review-any") === "object") {
			if (router.query.reviewed === undefined) {
				document.getElementById("review-any").checked = true;
			} else if (router.query.reviewed === true) {
				document.getElementById("review-no").checked = true;
			} else {
				document.getElementById("review-yes").checked = true;
			}
		}
        setRequireDL(router.query.hasDownload);
        document.getElementById("from").value = router.query.createdFrom?.toString() ?? "";
        setCreatedFrom(router.query.createdFrom?.toString() ?? "")
        document.getElementById("to").value = router.query.createdTo?.toString() ?? "";
        setCreatedTo(router.query.createdTo?.toString() ?? "")



        setLoadedSaveFile(true);
    }, [router, loadedSaveFile])


    const startSearch = useCallback(
        async (evt: React.FormEvent<HTMLFormElement>): Promise<void> => {
            evt.preventDefault();

            const searchParams = new URLSearchParams();
            // TODO: set these all at once
            title && searchParams.set("name", title);
            specifiedRating && searchParams.set("ratingFrom", String(ratingRange[0]));
            specifiedRating && searchParams.set("ratingTo", String(ratingRange[1]));
            specifiedDifficulty &&
                searchParams.set("difficultyFrom", String(difficultyRange[0]));
            specifiedDifficulty &&
                searchParams.set("difficultyTo", String(difficultyRange[1]));
            author && searchParams.set("author", author);
            tags && searchParams.set("tags", tags);
            !isUndefined(hasCleared) && searchParams.set("cleared", hasCleared);
            !isUndefined(hasReviewed) && searchParams.set("reviewed", hasReviewed);
            requireDL && searchParams.set("hasDownload", String(requireDL));
            createdFrom && searchParams.set("createdFrom", createdFrom);
            createdTo && searchParams.set("createdTo", createdTo);

            router.push(`/search?${searchParams}`);
        },
        [
            createdFrom,
            createdTo,
            difficultyRange,
            ratingRange,
            requireDL,
            router,
            specifiedDifficulty,
            specifiedRating,
            title,
            author,
            hasCleared,
            hasReviewed,
            tags,
        ],
    );

    const [feelinLuckyState, setFeelinLuckyState] = useState<string>("none");
    const [feelinLuckySearchPage, setFeelinLuckySearchPage] = useState<number>(0);
    const [feelinLuckyBuffer, setFeelinLuckyBuffer] = useState<Array<number>>(new Array());

    const feelinLuckySearch = useCallback(async () => {
        if (feelinLuckyState === "done") { router.push(`/game/${Number(feelinLuckyBuffer[Math.round(Math.random() * feelinLuckyBuffer.length)])}`) }
        if (feelinLuckyState !== "searching") { return }
        if (feelinLuckyBuffer.length >= 1000) {
            setFeelinLuckyState("done");
            return
        }

        // HACK: useTimer will just re-run, even if the promise has not resolved, so pause until we're finished
        feelinLuckyTimer.pause();

        try {
            const games = (await API.games().getGames(session.active ? `Bearer ${session.token}` : undefined, title, undefined, false, undefined, undefined, undefined, tags === "" ? undefined : tags, author === "" ? undefined : author, undefined, Boolean(requireDL), createdFrom == "" || createdFrom == new Date(0) ? undefined : createdFrom, createdTo == "" || createdTo == new Date(0) ? undefined : createdTo, undefined, undefined, ratingRange[0], ratingRange[1], difficultyRange[0], difficultyRange[1], feelinLuckySearchPage, 5, void 0, void 0)).data;

            if (games.length < 5) {
                setFeelinLuckyState("done");
            } else {
                setFeelinLuckySearchPage(feelinLuckySearchPage + 1);
            }

            if (feelinLuckySearchPage === 0 && games.length === 0) {
                setFeelinLuckyState("error2");
                return
            }

            const buf = new Array(games.length);
            for (const g of games) {
                buf.pop(); // HACK: node is too stupid to just replace the undefined values
                buf.unshift(g.id);
            }
            setFeelinLuckyBuffer([...feelinLuckyBuffer, ...buf]);
            // HACK: continue timer execution
            feelinLuckyTimer.start();

        } catch (e) {
            console.error("search api failure");
            console.error(e);
            setFeelinLuckyState("error");
            feelinLuckyTimer.pause();
            return;
        }
    }
        , [feelinLuckyState, feelinLuckyBuffer, feelinLuckySearchPage, requireDL, createdFrom, createdTo, ratingRange, difficultyRange, tags, session, title, author])

    const feelinLuckyTimer = useTimer({ initialTime: 150, interval: 20, endTime: 0, autostart: false, countdown: true, autoreset: true, onEnd: feelinLuckySearch });

    const feelinLuckyStartSearch = useCallback(() => {
        switch (feelinLuckyState) {
            case "none":
                console.log("starting");
                setFeelinLuckyState("searching");
                feelinLuckyTimer.start();
                break;
        }
    }, [feelinLuckyTimer, feelinLuckyState]);

    const feelinLuckyButton = useCallback(() => {
        switch (feelinLuckyState) {
            case "none":
                return (<input type="button" id="lucky" value="I'm feeling lucky!" onClick={feelinLuckyStartSearch} />)
            case "searching":
                return (<><input type="button" id="lucky" value="I'm feeling lucky!" disabled={true} /><progress value="indeterminate" /></>)
            case "error":
                return (<input type="button" id="lucky" value="Search is overloaded! Please try again later." disabled={true} />)
            case "error2":
                return (<input type="button" id="lucky" value="Range is too narrow. Refresh and increase your parameters." disabled={true} />)
            default: return (<></>)
        }
    }, [feelinLuckyState, feelinLuckyStartSearch])



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
                                    defaultValue={title}
                                    onChange={async (evt) => {
                                        setTitle(evt.currentTarget.value);
                                    }}
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
                                    onChange={async (
                                        evt: ChangeEvent<HTMLInputElement>,
                                    ): Promise<void> => {
                                        setAuthor(evt.currentTarget.value);
                                    }}
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
                                    defaultValue=""
                                    onChange={async (
                                        evt: ChangeEvent<HTMLInputElement>,
                                    ): Promise<void> => {
                                        setTags(evt.currentTarget.value);
                                    }}
                                />

                                {/*
                                <input type="radio" id="include" name="t_inc" value="include" />
                                <label htmlFor="include">Include</label>
                                <input type="radio" id="exclude" name="t_inc" value="exclude" />
                                <label htmlFor="exclude">Exclude</label>
                                */}

                                <br />
                                <Link target="_blank" rel="noopener noreferrer" href="/game/tags">
                                    <button type="button" id="show-tags" className="mb-[5px]">
                                        See All Existing Tags
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    id="hide-tags"
                                    className="mb-[5px] hidden"
                                >
                                    Hide Tags
                                </button>
                                <div id="tags-list" className="py-0 px-[5px] hidden" />

                                {/* #region Session Based */}
                                {!session.active ? (
                                    <></>
                                ) : (
                                    <>
                                        {/* Clear */}
                                        <div>
                                            Cleared by me?
                                            <br />
                                            <label htmlFor="clear-any">
                                                <input
                                                    id="clear-any"
                                                    type="radio"
                                                    name="clear"
                                                    value=""
                                                    onClick={async (
                                                        _: React.MouseEvent<HTMLInputElement, MouseEvent>,
                                                    ): Promise<void> => {
                                                        setHasCleared(void 0);
                                                    }}
                                                />{" "}
                                                Any
                                            </label>
                                            <label htmlFor="clear-uncleared">
                                                <input
                                                    id="clear-uncleared"
                                                    type="radio"
                                                    name="clear"
                                                    value="0"
                                                    onClick={async (_): Promise<void> => {
                                                        setHasCleared(false);
                                                    }}
                                                />{" "}
                                                Not Cleared
                                            </label>
                                            <label htmlFor="clear-cleared">
                                                <input
                                                    id="clear-cleared"
                                                    type="radio"
                                                    name="clear"
                                                    value="1"
                                                    onClick={async (_): Promise<void> => {
                                                        setHasCleared(true);
                                                    }}
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
                                                    onClick={async (_): Promise<void> => {
                                                        setHasReviewed(void 0);
                                                    }}
                                                />{" "}
                                                Any
                                            </label>
                                            <label htmlFor="review-no">
                                                <input
                                                    id="review-no"
                                                    type="radio"
                                                    name="ireviewed"
                                                    value="0"
                                                    onClick={async (_): Promise<void> => {
                                                        setHasReviewed(false);
                                                    }}
                                                />{" "}
                                                Not Reviewed
                                            </label>
                                            <label htmlFor="review-yes">
                                                <input
                                                    id="review-yes"
                                                    type="radio"
                                                    name="ireviewed"
                                                    value="1"
                                                    onClick={async (_): Promise<void> => {
                                                        setHasReviewed(true);
                                                    }}
                                                />{" "}
                                                Reviewed
                                            </label>
                                        </div>
                                    </>
                                )}
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
                                    {feelinLuckyButton()}
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
