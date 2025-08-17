export default function Carousel(): JSX.Element {
	return (
		<div className="!ml-[50%]">
			<h2>Screenshots</h2>
			<div className="!float-left !w-[370px]">
				<div className="pika-stage">
					<a href="/" title target>
						<img src="" className="!left-[0px]"/>
					</a>
					<div className="pika-imgnav" className="!display-block !opacity-[1]">
						No Screenshots for this game... Why not add one?
					</div>
					<div className="pika-aniwrap">
						<img className="!hidden"/>
						<div className="pika-ani !relative">
							<div col="0" row="0"></div>
						</div>
					</div>
					<div className="pika-textnav">
						<a className="previous">Previous</a>
						<a className="next">Next</a>
					</div>
					<div className="pika-loader !hidden">Loading</div>
				</div>
				<div className=" jcarasoul-skin-pika">
					<div className="jcarousel-container jcarousel-container-horizontal !relative !display-block">
						<div className="jcarousel-clip jcarousel-clip-horizontal !relative">
							<ul id="images" className="pika-thumbs jcarousel-list jcarousel-list-horizontal !overflow-hidden !relative !top-[0px] !m-[0px] !p-[0px] !left-[0px] !w-[588px]">
								<li className="jcarousel-item jcarousel-item-horizontal jcarousel-item-1 jcarousel-item-1-horizontal !float-left !list-none">
								<div className="clip"></div>
									<img src="" className="!hidden"/>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}