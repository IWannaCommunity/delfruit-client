// Okay so the news component on the home page and the news components 
// on the news pages are somewhat different and I'm not sure whether
// to make them separate or not. Seems like a waste to separate them
// but I'm just leaving this here as a placeholder for now

export default function HomeNews(): JSX.Element {
	return (
		<div className="!relative !p-[0.5em] !bg-[#e8e8e8]">
			<h2>DelFruit News</h2>
			<h3>DelFruit 2</h3>
			<p>
				Lorem ipsum dolor sit amet. Et autem deserunt eos repellendus aperiam aut perspiciatis quos est quod adipisci eos quam quis qui harum ullam. Et nobis distinctio et nesciunt incidunt aut error 
				sint a incidunt vero sit incidunt deleniti ut officiis ullam. Eum internos temporibus quo fugiat obcaecati in impedit facilis et consequatur deserunt quo facere totam. Non veritatis porro et 
				iste molestias qui dolore reprehenderit ut provident tenetur ad tempora eius vel molestiae commodi aut saepe atque?
			</p>
			<div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
				-TTBB on Aug 13, 2025
			</div>	
		</div>
	);
}