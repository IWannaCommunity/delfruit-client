// Okay so the news component on the home page and the news components
// on the news pages are somewhat different and I'm not sure whether
// to make them separate or not. Seems like a waste to separate them
// but I'm just leaving this here as a placeholder for now

export default function HomeNews(): JSX.Element {
    return (
        <div className="!relative !p-[0.5em] !bg-[#e8e8e8]">
            <h2>DelFruit News</h2>
            <h3>hello world</h3>
            <p>welcome 2 my site</p>
            <div className="!absolute !right-[0px] !top-[0px] !p-[0.5em] !text-right">
                -Starz0r on Apr 1, 2026
            </div>
        </div>
    );
}

