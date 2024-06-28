import type {FC} from "react";
import {useLocation} from "react-router-dom";
import {SlideResult} from "../global";
import { RadarChart } from '@mantine/charts';

// const sampleResult = [{countPercentage: 80, speed: 50, positive: 50}, {
//     countPercentage: 60,
//     speed: 50,
//     positive: 50
// }, {countPercentage: 20, speed: 50, positive: 50}]

const Result: FC = () => {
    const location = useLocation();
    console.log(location)

    const countPages = location.state.length;
    console.log(countPages);

    const totalEye = location.state.map(obj => {
        return obj.countPercentage
    }).reduce((acc, cur) => acc + cur, 0)
    console.log(totalEye)

    const eyeScore = Math.floor(totalEye / countPages);
    console.log(eyeScore);

    const scoreData = [{product: '目線', score: eyeScore, threshold: 80}, {product: '速度', score: 30,threshold: 80}, {product: 'ハキハキ', score: 40, threshold: 80}, {product: '時間', score: 90, threshold: 80}, {product: '繋ぎ言葉', score: 100, threshold: 80}]


    return (
        <>
            <h1>Resultページです</h1>
            <RadarChart h={300}
                        data={scoreData}
                        dataKey="product"
                        series={[{ name: 'score', color: 'blue.4', opacity: 0.2 }, { name: 'threshold', color: 'red.4', opacity: 0.2 }]}
                        withPolarGrid
                        withPolarAngleAxis
            />
            {location.state.map((result: SlideResult, index: number) => <p
                key={index}>{result.countPercentage} {result.elapsedTime}</p>)}
        </>
    )
}

export default Result