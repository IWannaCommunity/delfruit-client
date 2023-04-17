import { times } from "lodash";
import RatingHeart from "./ratingheart";

export default function Rating({ className, value }) {
    const hearts = Math.floor(value / 10);
    return (<div className={className}>{times(hearts, () => <RatingHeart filled={true} />)}
        {times(Math.ceil(10 - hearts), () => <RatingHeart filled={false} />)}</div>);
}

