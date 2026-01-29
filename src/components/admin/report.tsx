import Link from "next/link";
import React from "react";
import { Report as ReportT } from "delfruit-swagger-cg-sdk";
import { ReportTypeEnum } from "delfruit-swagger-cg-sdk";
import { formatDate } from "@/utils/formatDate";

type ReportProps = ReportT & {
	onResolve: () => void;
};

function getReportTargetHref(
	type: ReportTypeEnum,
	targetId?: number | null
): string {
	if (!targetId) return "#";

	switch (type) {
		case ReportTypeEnum.Review:
		case ReportTypeEnum.ReviewRestore:
			return `/review/${targetId}`;

		case ReportTypeEnum.Game:
		case ReportTypeEnum.GameAdd:
		case ReportTypeEnum.GameRemove:
		case ReportTypeEnum.GameUpdate:
		case ReportTypeEnum.GameUpdateUrl:
		case ReportTypeEnum.GameUpdateOwner:
		case ReportTypeEnum.GameUpdateCreator:
			return `/game/${targetId}`;

		case ReportTypeEnum.Screenshot:
		case ReportTypeEnum.ScreenshotRemove:
			return `/screenshot/${targetId}`;

		case ReportTypeEnum.User:
		case ReportTypeEnum.UserRegister:
		case ReportTypeEnum.UserPasswordChange:
			return `/profile/${targetId}`;

		default:
			return "#";
	}
}

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
			<Link href={getReportTargetHref(props.type, props.targetId)}>
				{props.type}
			</Link>
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