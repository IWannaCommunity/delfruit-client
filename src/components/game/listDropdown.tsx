import React from "react";

interface ListDropdownProps {
	selectedLists: string[];
	pendingLists?: string[];
	customLists?: string[];
	onToggleList: (listId: string, selected: boolean) => void;
	onCreateList?: () => void;
}

const PINNED_LISTS = [
	{ id: "favorites", name: "Favorites" },
	{ id: "cleared", name: "Cleared" },
	{ id: "bookmarks", name: "Bookmarks" },
];

export default function ListDropdown({
	selectedLists,
	pendingLists = [],
	customLists = [],
	onToggleList,
	onCreateList,
}: ListDropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const dropdownRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	function renderList(id: string, name: string) {
		const selected = selectedLists.includes(id);
		const pending = pendingLists.includes(id);

		return (
			<label key={id} className="list-dropdown-option">
				<span>{name}</span>
				<input
					type="checkbox"
					checked={selected}
					disabled={pending}
					onChange={(event) =>
						onToggleList(id, event.target.checked)
					}
				/>
			</label>
		);
	}

	return (
		<div className="list-dropdown" ref={dropdownRef}>
			<button
				type="button"
				className="list-dropdown-trigger"
				onClick={() => setIsOpen((previous) => !previous)}
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<span>Save to list</span>
				<span className="list-dropdown-arrow">
					{isOpen ? "▲" : "▼"}
				</span>
			</button>

			{isOpen && (
				<div className="list-dropdown-menu">
					<div className="list-dropdown-heading">
						Save to list
					</div>

					<div className="list-dropdown-section">
						<div className="list-dropdown-section-title">
							Pinned lists
						</div>

						{PINNED_LISTS.map((list) =>
							renderList(list.id, list.name)
						)}
					</div>

					{customLists.length > 0 && (
						<div className="list-dropdown-section">
							<div className="list-dropdown-section-title">
								Your lists
							</div>

							{customLists.map((list) =>
								renderList(`custom-${list}`, list)
							)}
						</div>
					)}

					<div className="list-dropdown-footer">
						<button
							type="button"
							onClick={() => {
								setIsOpen(false);
								onCreateList?.();
							}}
						>
							+ Create new list
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
