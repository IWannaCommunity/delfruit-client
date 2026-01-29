import React, { useState, useEffect, useRef } from "react";
import { useSessionContext } from "@/utils/hooks";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Pagination from "@/components/helpers/pagination";
import ReportList from "@/components/admin/reportList";
import { ReportTypeEnum } from "delfruit-swagger-cg-sdk";
import { Filters } from "@/utils/types";

const REPORT_TYPES: [ReportTypeEnum | "all", string][] = [
	["all", "All"],
	[ReportTypeEnum.Review, "Review"],
	[ReportTypeEnum.ReviewRestore, "Review Restored"],
	[ReportTypeEnum.Game, "Game"],
	[ReportTypeEnum.GameAdd, "Game Added"],
	[ReportTypeEnum.GameRemove, "Game Removed"],
	[ReportTypeEnum.GameUpdateUrl, "Game Update Url"],
	[ReportTypeEnum.GameUpdateOwner, "Game Update Owner"],
	[ReportTypeEnum.GameUpdateCreator, "Game Update Creator"],
	[ReportTypeEnum.GameUpdate, "Game Updated"],
	[ReportTypeEnum.Screenshot, "Screenshot"],
	[ReportTypeEnum.ScreenshotRemove, "Screenshot Removed"],
	[ReportTypeEnum.User, "User"],
	[ReportTypeEnum.UserRegister, "User Registered"],
	[ReportTypeEnum.UserPasswordChange, "User Password Change"],
];

const ANSWERED_OPTIONS: [string, string][] = [
	["null", "All"],
	["true", "Yes"],
	["false", "No"],
];

const ORDER_OPTIONS: [string, string][] = [
	["ASC", "Ascending"],
	["DESC", "Descending"]
];

function parseFilters(formData: FormData): Filters {
	// type
	const rawType = formData.get("type") as string | null;
	let type: ReportTypeEnum | "all" = "all";
	if (
		rawType &&
		rawType !== "all" &&
		Object.values(ReportTypeEnum).includes(rawType as ReportTypeEnum)
	) {
		type = rawType as ReportTypeEnum;
	}

	// answered
	const rawAnswered = formData.get("answered") as string | null;
	let answered: boolean | null = null;
	if (rawAnswered === "true") answered = true;
	if (rawAnswered === "false") answered = false;

	// order
	const rawOrder = formData.get("order") as string | null;
	const order: "ASC" | "DESC" =
		rawOrder === "DESC" ? "DESC" : "ASC";

	return { type, answered, order };
}

function SelectField({ label, name, options, id }: {
	label: string;
	name: string;
	options: [string, string][];
	id: string;
}) {
	return (
		<div className="flex items-center">
			<label htmlFor={id} className="w-40 font-medium">
				{label}
			</label>
			<select name={name} id={id} className="w-60">
				{options.map(([value, text]) => (
					<option key={value} value={value}>
						{text}
					</option>
				))}
			</select>
		</div>
	);
}

export default function AdminDashboard(): JSX.Element {
	const [session] = useSessionContext();
	const [page, setPage] = useState<number>(0);
	const [searchId, setSearchId] = useState<number | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [filters, setFilters] = useState<Filters>({
		type: "all",
		answered: null,
		order: "ASC",
	});

	const router = useRouter();
	const totalPages = 10818; // HARD-CODED FOR NOW, RETRIEVE FROM API

	const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const rawId = formData.get("rid") as string | null;
		const id = rawId ? Number(rawId) : NaN;
		setSearchId(!isNaN(id) ? id : null);
		if (searchInputRef.current) {
			searchInputRef.current.value = "";
		}
		setPage(0);
		setFilters({ type: "all", answered: null, order: "ASC" })
	}

	const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFilters(parseFilters(new FormData(e.currentTarget)));
		setPage(0);
	};

	useEffect(() => {
		if (router.isReady) {
			const id = Number(router.query.id);

			// Anti-trolling measures
			if (isNaN(id) || id < 0) {
				router.replace({ pathname: "/admin/[id]", query: { id: 0 } });
				return;
			}

			setPage(id);
		}
	}, [router, router.isReady, router.query.id]);

	const renderContent = () => {
		if (!session.active || !session.admin) {
			return <span>You do not have access to this page</span>;
		}

		return (
			<>
				<h2>Welcome to the admin page!</h2>

				<h2>Tools</h2>
				<div>
					<p>
						<Link href="/admin/display_logs">Display logs</Link>
					</p>
					<p>
						<Link href="/admin/write_news">Write news entry</Link>
					</p>
				</div>

				<h2>Reports</h2>

				{/* Get report by ID */}
				<form onSubmit={handleSearchSubmit} className="mb-5 flex items-center gap-2">
					<label htmlFor="rid" className="font-medium whitespace-nowrap">
						Get Report by ID:
					</label>
					<input id="rid"
						name="rid"
						type="text"
						size={5}
						className="w-20"
						ref={searchInputRef}
					/>
					<input type="submit" value="Search" />
				</form>

				{/* Filters form */}
				<form onSubmit={handleFilterSubmit}>
					<SelectField
						label="Show Report Type:"
						name="type"
						id="type"
						options={REPORT_TYPES}
					/>
					<SelectField
						label="Answered:"
						name="answered"
						id="answered"
						options={ANSWERED_OPTIONS}
					/>
					<SelectField
						label="Order:"
						name="order"
						id="order"
						options={ORDER_OPTIONS}
					/>
					<div>
						<input type="submit" value="Filter" />
					</div>
				</form>
				<Pagination page={page} totalPages={totalPages} basePath="/admin/[id]"/>
				<ReportList page={page} limit={20} filters={filters} searchId={searchId}/>
				<Pagination page={page} totalPages={totalPages} basePath="/admin/[id]"/>
			</>
		);
	}

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					{renderContent()}
				</div>
				<Footer />
			</div>
		</div>
	);
}