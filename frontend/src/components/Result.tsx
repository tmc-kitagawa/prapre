import {FC, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {SlideResult} from "../global";

import OneBarChart from "./OneBarChart.tsx";

import {RadarChart} from '@mantine/charts';
import {NavLink} from "@mantine/core";

// import axios from "axios";
// const sampleResult = [{countPercentage: 80, speed: 50, positive: 50}, {
//     countPercentage: 60,
//     speed: 50,
//     positive: 50
// }, {countPercentage: 20, speed: 50, positive: 50}]

interface Props {
    fillers: number[]
}

const Result: FC<Props> = ({fillers}) => {
    const location = useLocation();
    console.log(location)
    // const eyeSlideScore:Props = {graphTitle: "目線がカメラを向いているか",data: useLocation().state.map((obj: SlideResult, idx: number) => ({
    //         page: "slide " + (idx + 1),
    //         score: obj.countPercentage
    //     }))}
    const data: Record<string, any>[] = useLocation().state.map((obj: SlideResult, idx: number) => ({
        slide: "slide " + (idx + 1),
        score: obj.countPercentage
    }))

    const dataSpeed: Record<string, any>[] = useLocation().state.map((obj: SlideResult, idx: number) => ({
        slide: "slide " + (idx + 1),
        score: obj.countFastSpeed
    }))

    const countPages = location.state.length;
    console.log(countPages);

    const totalEye = location.state.map((obj: SlideResult) => {
        return obj.countPercentage
    }).reduce((acc: number, cur: number) => acc + cur, 0)
    console.log(totalEye)

    const eyeScore = Math.floor(totalEye / countPages);
    console.log(eyeScore);

    const totalSpeed = location.state.map((obj: SlideResult) => {
        return obj.countFastSpeed
    }).reduce((acc: number, cur: number) => acc + cur, 0)
    console.log(totalSpeed)

    const speedScore = Math.floor(totalSpeed / countPages);
    console.log(eyeScore);

    const scoreData = [{product: '目線', score: eyeScore, threshold: 80}, {
        product: '速度',
        score: speedScore,
        threshold: 80
    }, {product: 'ハキハキ', score: 40, threshold: 80}, {
        product: '時間',
        score: 90,
        threshold: 80
    }, {product: '繋ぎ言葉', score: 100, threshold: 80}]

    useEffect(() => {
        while(document.getElementById("webgazerVideoContainer")){
            document.getElementById("webgazerVideoContainer")!.remove()
        }
        // document.getElementById("webgazerVideoFeed").style.display = 'none'

    }, []);

    // setTimeout(async () => {
    //     const res = await axios.post("/api/histories", {
    //         title: "prapre",
    //         startTime: 1719904090394,
    //         userId: 1,
    //         scoreEye: 50,
    //         scoreVolume: 68,
    //         scoreFiller: 5,
    //         scoreSpeed: 60,
    //         scoreTime: 70
    //     });
    //     console.log(res);
    // }, 5000)

    return (
        <>
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
            <NavLink label="結果の詳細を表示" defaultOpened>
                <OneBarChart key="eye" graphTitle="目線がカメラを向いているか" slideScore={data}/>
                <OneBarChart key="speed" graphTitle="話す速度" slideScore={dataSpeed}/>
            </NavLink>
            {JSON.stringify(fillers)}
        </>
    )
}

export default Result