import React from "react";

export type Column<T> = {
	key: keyof T;
	label: string;
	render?: (value: any, row: T) => React.ReactNode;
};

export type SortConfig<T> = { column: keyof T; direction: "asc" | "desc" } | null;

type DataTableProps<T> = {
	data: T[];
	columns: Column<T>[];
	sortConfig: SortConfig<T> | null;
	onSortChange: (newConfig: SortConfig<T>) => void;
};

export function DataTable<T extends { id: number | string }>({
	data,
	columns,
	sortConfig,
	onSortChange
}: DataTableProps<T>) {
	const handleSort = (column: keyof T) => {
		if (sortConfig?.column === column) {
			onSortChange({
				column,
				direction: sortConfig.direction === "asc" ? "desc" : "asc",
			});
		} else {
			onSortChange({ column, direction: "asc" });
		}
	};

	const getSortIcon = (column: keyof T) => {
		if (sortConfig?.column !== column) return "/images/bg.gif";
		return sortConfig.direction === "asc" ? "/images/asc.gif" : "/images/desc.gif";
	};

	return (
		<>
			<table className="tablesorter min-w-[600px] w-full">
				<thead>
					<tr>
						{columns.map(({ key, label }) => (
							<th
								key={String(key)}
								className={`cursor-pointer ${
									sortConfig?.column === key ? "bg-[#8DBDD8]" : "bg-[#E6EEEE]"
								} bg-right bg-no-repeat p-[4px] border border-solid border-white`}
								style={{ backgroundImage: `url(${getSortIcon(key)})` }}
								onClick={() => handleSort(key)}
							>
								{label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row) => (
						<tr key={row.id}>
							{columns.map(({ key, render }) => (
								<td key={String(key)} className="p-2 border border-[#ddd]">
									{render ? render((row as any)[key], row) : (row as any)[key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}