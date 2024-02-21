import { times } from "lodash";
import DifficultySpike from "./difficultyspike";

export default function Difficulty({ className, value }) {
    const spikes = Math.floor(value / 10);
    return (<div className={className}>{times(spikes, (idx) => <DifficultySpike key={idx} filled={true} />)}
        {times(Math.ceil(10 - spikes), (idx) => <DifficultySpike key={idx + spikes} filled={false} />)}</div>);
}
