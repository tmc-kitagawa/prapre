import {FC, MutableRefObject, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Center} from '@mantine/core';
import "./Presentation.scss"
import { SlideResult } from "../global";

import SpeedMeter from "./SpeedMeter";

// interface SlideResult {
//     countPercentage: number,
//     elapsedTime: number
// }

const Presentation: FC = () => {
    const navigate = useNavigate();

    let countVariable: MutableRefObject<number> = useRef(0);
    let countAll: MutableRefObject<number> = useRef(0);
    let slideStartTime: MutableRefObject<number> = useRef(0)
    let countPercentage: MutableRefObject<number> = useRef(0)
    let elapsedTime: MutableRefObject<number> = useRef(0)
    const arrSlideResult: SlideResult[] = [];

    const webgazer = window.webgazer;
    useEffect(() => {
        webgazer
            .setGazeListener((data: any) => {
                data.y < 300 && ++countVariable.current;
                ++countAll.current;
                console.log("countVariable : ", countVariable)
                console.log("countAll      : ", countAll)
            })
            .begin();
    }, [])

    const startHandle = () => {
        countVariable.current = 0;
        countAll.current = 0;
        slideStartTime.current = Number(new Date())
    }

    const slideHandle = () => {
        countPercentage.current = Math.floor((countVariable.current * 100) / countAll.current);
        elapsedTime.current = Number(new Date()) - slideStartTime.current;
        arrSlideResult.push({countPercentage: countPercentage.current, elapsedTime: elapsedTime.current})
        // console.log("countPercentage :", countPercentage.current)
        // console.log("elapsedTime :", elapsedTime.current)
        startHandle();
    }

    const stopHandle = () => {
        slideHandle();
        // countPercentage.current = Math.floor((countVariable.current * 100)/countAll.current);
        // elapsedTime.current = Number(new Date()) - slideStartTime.current;
        // console.log("countPercentage :" , countPercentage.current)
        // console.log("elapsedTime :" , elapsedTime.current)
        // const webgazer = window.webgazer;
        webgazer.end();
        console.log(arrSlideResult);
        navigate("/result", {state: arrSlideResult})
    }


    return (
        <>
            <Center>
                <h1>Presentationページです</h1>
                <Button onClick={startHandle}>スタート</Button>
                <button onClick={slideHandle}>スライドめくる</button>
                <Button onClick={stopHandle}>ストップ</Button>
                <SpeedMeter />
            </Center>
        </>
    )
}

export default Presentation