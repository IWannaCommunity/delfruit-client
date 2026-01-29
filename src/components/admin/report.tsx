import Link from "next/link";
import React from "react";
import { Report as ReportT } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";

type ReportProps = ReportT & {
	onResolve: () => void;
};

export default function Report(props: ReportProps): JSX.Element {
	const isAnswered = Boolean(props.dateAnswered);

	return (
		<div className="reportDiv">
			<span>ID: {props.id}</span>
			<br />
			<span>Reported by: {props.reporterName}</span>
			<br />
			<span>Reported on: {props.dateCreated}</span>
			<br />
			<span>Reported Type: </span>
			<Link href="/">{props.type}</Link>
			<br />
			<br />
			<span>Report: {props.report}</span>
			<br />
			<br />
			
			{isAnswered ? (
				<div>
					<span>Resolved by: </span>
					{props.answeredByName ?? "Unknown"}
					<br />
					<span>On: </span>
					{formatDate(new Date(props.dateAnswered), true)}
				</div>
			) : (
				<button
					id="btnResolve"
					type="button"
					className="btnResolve"
					onClick={() => props.onResolve()}
				>
					Resolve
				</button>
			)}
		</div>
	);
}