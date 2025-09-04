import { AnyElem } from "@/utils/element";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function ReviewPagination({page, totalPages}: PaginationProps): AnyElem {

	const lastPage = totalPages - 1;
	const pageCount = 10;

	// Center current page in the middle
	let start = Math.max(0, page - Math.floor(pageCount / 2));
	let end = start + pageCount - 1;

	// Prevent going past end
	if (end > lastPage) {
		end = lastPage;
		start = Math.max(0, end - pageCount + 1);
	}

	const pagesToShow = Array.from({length: end - start + 1}, (_, i) => start + i);

	return (
		<div className="text-center">
			<span>Go to page: </span>
			<br />

			{/* First page */}
			{page > 0 && (
				<Link
					href={{pathname: "/reviews/[id]", query: { id: 0 }}}
					className="mr-1"
				>
					First
				</Link>
			)}

			{/* Previous 10 ( << ) */}
			{page - pageCount >= 0 && (
				<Link
					href={{pathname: "/reviews/[id]", query: { id: page - pageCount }}}
					className="mr-1"
				>
					&lt;&lt;
				</Link>
			)}

			{/* Previous ( < ) */}
			{page > 0 && (
				<Link
					href={{pathname: "/reviews/[id]", query: { id: page - 1 }}}
					className="mr-1"
				>
					&lt;
				</Link>
			)}

			{/* Page numbers (disable current) */}
			{pagesToShow.map((p) => {
			if (p === page) {
				return (
					<span key={p} className="mr-1">
						{p}
					</span>
				);
			}
			return (
				<Link
					key={p}
					href={{pathname: "/reviews/[id]", query: { id: p }}}
					className="mr-1"
				>
					{p}
				</Link>
			);
		})}

			{/* Next ( > ) */}
			{page < lastPage && (
				<Link
					href={{pathname: "/reviews/[id]", query: { id: page + 1 }}}
					className="mr-1"
				>
					&gt;
				</Link>
			)}

			{/* Next 10 ( >> ) */}
			{page + pageCount <= lastPage && (
				<Link
					href={{pathname: "/reviews/[id]", query: { id: page + pageCount }}}
					className="mr-1"
				>
					&gt;&gt;
				</Link>
			)}

			{/* Last page */}
			{page < lastPage && (
				<Link href={{pathname: "/reviews/[id]", query: { id: lastPage }}}>
					Last
				</Link>
			)}
		</div>
	);
}