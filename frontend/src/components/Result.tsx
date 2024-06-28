import type {FC} from "react";
import { useLocation } from "react-router-dom";
import { SlideResult } from "../global";
// import { RadarChart } from '@mantine/charts';

const sampleResult = [{countPercentage: 80, speed: 50, positive: 50}, {countPercentage: 60, speed: 50, positive: 50}, {countPercentage: 20, speed: 50, positive: 50}]


const Result: FC = () => {
    const location = useLocation();
    console.log(location)
    const countPages = sampleResult.length;
    console.log(countPages);
    const totalEye = sampleResult.map(obj => {
        return obj.countPercentage
    }).reduce((acc, cur) => acc + cur, 0)
   console.log(totalEye)
    const eyeScore = Math.floor(totalEye / countPages * 100);
    console.log(eyeScore);
    return (
        <>
            <h1>Resultページです</h1>
            {/*<RadarChart h={300}*/}
            {/*            data={}*/}
            {/*            dataKey="product"*/}
            {/*            withPolarRadiusAxis*/}
            {/*            series={[{ name: 'sales', color: 'blue.4', opacity: 0.2 }]}*/}
            {/*/>*/}
            {location.state.map((result: SlideResult, index: number ) => <p key={index}>{result.countPercentage} {result.elapsedTime}</p>)}
        </>
    )
}

export default Result