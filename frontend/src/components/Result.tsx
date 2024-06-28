import type {FC} from "react";
import {useLocation} from "react-router-dom";
import {SlideResult} from "../global";
import {RadarChart} from '@mantine/charts';
import {BarChart} from '@mantine/charts';

// const sampleResult = [{countPercentage: 80, speed: 50, positive: 50}, {
//     countPercentage: 60,
//     speed: 50,
//     positive: 50
// }, {countPercentage: 20, speed: 50, positive: 50}]

const Result: FC = () => {
    const location = useLocation();
    console.log(location)
    const data = useLocation().state.map((obj: SlideResult, idx: number)=> ({page: idx + 1, eyeScore:obj.countPercentage}))

    const countPages = location.state.length;
    console.log(countPages);

    const totalEye = location.state.map((obj: SlideResult)=> {
        return obj.countPercentage
    }).reduce((acc: number, cur:number) => acc + cur, 0)
    console.log(totalEye)

    const eyeScore = Math.floor(totalEye / countPages);
    console.log(eyeScore);

    const scoreData = [{product: '目線', score: eyeScore, threshold: 80}, {
        product: '速度',
        score: 30,
        threshold: 80
    }, {product: 'ハキハキ', score: 40, threshold: 80}, {
        product: '時間',
        score: 90,
        threshold: 80
    }, {product: '繋ぎ言葉', score: 100, threshold: 80}]


    return (
        <>
            <h1>Resultページです</h1>
            <RadarChart h={300}
                        data={scoreData}
                        dataKey="product"
                        series={[{name: 'score', color: 'blue.4', opacity: 0.2}, {
                            name: 'threshold',
                            color: 'red.4',
                            opacity: 0.2
                        }]}
                        withPolarGrid
                        withPolarAngleAxis
            />
            <BarChart
                h={250}
                w={700}
                data={data}
                dataKey="page"
                type="stacked"
                withLegend
                referenceLines={[
                    {
                        y: 80,
                        color: 'red.5',
                        labelPosition: 'insideTopRight',
                    },
                ]}
                legendProps={{verticalAlign: 'bottom'}}
                series={[
                    {name: 'eyeScore', label: '目線がカメラを向いているか', color: 'blue.4'},
                ]}
            />
        </>
    )
}

export default Result