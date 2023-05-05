export default function DifficultySpike({ filled }) {
    let color = "#E4E4E4";
    if (filled) {
        color = "#1EB475";
    }
    return (<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.595152 20.149L11 0.899994L21.4048 20.149C22.1251 21.4815 21.1602 23.1 19.6454 23.1H2.35457C0.839797 23.1 -0.125147 21.4815 0.595152 20.149Z" fill={color} />
    </svg>
    );
}
