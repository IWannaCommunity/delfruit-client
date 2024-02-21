import { times } from "lodash";
import RatingHeart from "./ratingheart";

export default function Rating({ className, value }) {
    const hearts = Math.floor(value / 10);
    return (<div className={className}>{times(hearts, (idx) => <RatingHeart key={idx} filled={true} />)}
        {times(Math.ceil(10 - hearts), (idx) => <RatingHeart key={idx + hearts} filled={false} />)}</div>);
}

