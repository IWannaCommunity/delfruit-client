import Link from "next/link";
import React from "react";
import { Report as ReportT } from "delfruit-swagger-cg-sdk";

export default function Report(props: ReportT): JSX.Element {

	return (
		<div className="reportDiv">
			<span> ID: {props.id}</span>
			<br/>
			<span> Reported by: {props.reporterName}</span>
			<br/>
			<span> Reported on: {props.dateCreated}</span>
			<br/>
			<span> Reported Type: </span>
			<Link href="/">{props.type}</Link>
			<br/>
			<br/>
			<span> Report: {props.report}</span>
			<br/>
			<br/>
			<button id="btnResolve" type="submit" className="btnResolve">
				Resolve
			</button>
		</div>
	);
}
