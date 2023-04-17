const HeaderItem = ({title}) => {
	return (
		<div className="flex cursor-pointer hover:text-[#F9F9F9]">
			<p className="opacity-100">{title}</p>
		</div>
	);
}

export default HeaderItem;