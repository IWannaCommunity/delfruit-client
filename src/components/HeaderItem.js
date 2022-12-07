function HeaderItem({title}) {
	return (
		<div className="flex cursor-pointer hover:text-white">
			<p className="opacity-100">{title}</p>
		</div>
	);
}

export default HeaderItem;