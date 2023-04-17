import { times } from "lodash";
import DifficultySpike from "./difficultyspike";

export default function Difficulty({ className, value }) {
    const spikes = Math.floor(value / 10);
    return (<div className={className}>{times(spikes, () => <DifficultySpike filled={true} />)}
        {times(Math.ceil(10 - spikes), () => <DifficultySpike filled={false} />)}</div>);
}
