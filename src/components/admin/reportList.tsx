import Report from "@/components/admin/report";
import { Report as ReportT } from "delfruit-swagger-cg-sdk";
import { API } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { Filters } from "@/utils/types";

type ReportListProps = {
	page: number;
	limit: number;
	searchId: number | null;
	filters: Filters;
};

export default function ReportList(props: ReportListProps): JSX.Element {
	const [reports, setReports] = useState<ReportT[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchReports = useCallback(async () => {
		const { type, answered, order } = props.filters;
		const resp = await API.reports().getReports(
			props.page, // page
			props.limit, // limit
			"id", // orderCol
			order, // orderDir
			props.searchId ?? undefined, // id
			type !== "all" ? type : undefined, // type
			answered !== null ? answered: undefined, // answered
		);
		return resp.data;
	}, [props.limit, props.page, props.filters, props.searchId]);

	useEffect(() => {
		setLoading(true);

		(async () => {
			try {
				const newReports = await fetchReports();
				const reportProps: ReportT[] = newReports.map((r) => ({
					id: r.id,
					type: r.type,
					targetId: r.targetId,
					report: r.report,
					reporterId: r.reporterId,
					reporterName: r.reporterName,
					answeredById: r.answeredById,
					answeredByName: r.answeredByName,
					dateCreated: r.dateCreated
						? formatDate(new Date(r.dateCreated), true)
						: null,
					dateAnswered: r.dateAnswered
						? formatDate(new Date(r.dateAnswered), true)
						: null
				}));
				setReports(reportProps);
				setError(null);
			} catch (err: any) {
				setError("Failed to load reports.");
			} finally {
				setLoading(false);
			}
		})();
	}, [fetchReports]);

	return (
		<>
			{loading ? (
				<span>Loading...</span>
			) : error ? (
				<span className="text-red-600">{error}</span>
			) : (
				<>
					{reports.map((r) => {
						return (
							<Report
								key={r.id}
								id={r.id}
								type={r.type}
								targetId={r.targetId}
								report={r.report}
								reporterId={r.reporterId}
								reporterName={r.reporterName}
								answeredById={r.answeredById}
								answeredByName={r.answeredByName}
								dateCreated={r.dateCreated}
								dateAnswered={r.dateAnswered}
							/>
						);
					})}
				</>
			)}
		</>
	);
}
