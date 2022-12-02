function HomeNews() {
	return (
		<nav className="bg-black bg-news-bg flex flex-col h-96 justify-center items-center">
			<div className="overflow-auto bg-[#232123] text-white font-bold px-5 rounded-t-lg p-2 w-4/12 h-10 flex justify-end">
				New Delfruit Redesign!
			</div>
			<div className="overflow-auto bg-white font-bold text-[#232123] rounded-b-lg p-5 w-4/12 h-3/6 flex justify-start">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium mi a venenatis pellentesque. Maecenas elementum in metus ut placerat. Integer eget porttitor ante. 
				Suspendisse ac arcu laoreet, sollicitudin dolor eu, dignissim libero. Mauris in ligula sem. Nulla ut nisl enim. Vivamus eu orci id purus laoreet mattis id eu risus. 
				Nullam nulla elit, iaculis nec consequat eget, vestibulum sit amet urna. Vestibulum at rhoncus mauris.
			</div>
		</nav>
	);
}

export default HomeNews;