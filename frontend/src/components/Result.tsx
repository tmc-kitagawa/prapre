import type {FC} from "react";
import { useLocation } from "react-router-dom";
import { SlideResult } from "../global";

const Result: FC = () => {
    const location = useLocation();
    console.log(location)
    return (
        <>
            <h1>Resultページです</h1>
            {location.state.map((result: SlideResult, index: number ) => <p key={index}>{result.countPercentage} {result.elapsedTime}</p>)}
        </>
    )
}

export default Result