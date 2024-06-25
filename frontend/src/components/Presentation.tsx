import {FC, MutableRefObject, useEffect, useRef} from "react";
import {Button, Center} from '@mantine/core';
import "./Presentation.scss"

const Presentation: FC = () => {
    let countValiable: MutableRefObject<number> = useRef(0);
    let countAll: MutableRefObject<number> = useRef(0);
    let slideStartTime:MutableRefObject<number> = useRef(0)
    let countPercentage : MutableRefObject<number> = useRef(0)
    let elapsedTime : MutableRefObject<number> = useRef(0)

    useEffect(() => {
        const webgazer = window.webgazer;
        webgazer
            .setGazeListener((data, clock) => {
                data.y < 300 && ++countValiable.current;
                ++countAll.current;
                console.log("countValiable : ", countValiable)
                console.log("countAll      : ", countAll)
            })
            .begin();
    }, [])

    const startHundle = () => {
        countValiable.current = 0;
        countAll.current = 0;
        slideStartTime.current = Number(new Date())
    }

    const stopHundle = () => {
        countPercentage.current = Math.floor((countValiable.current * 100)/countAll.current);
        elapsedTime.current = Number(new Date()) - slideStartTime.current;
        console.log("countPercentage :" , countPercentage.current)
        console.log("elapsedTime :" , elapsedTime.current)
        const webgazer = window.webgazer;
        webgazer.end();
    }



    return (
        <>
            <Center>
                <h1>Presentationページです</h1>
                <Button onClick={startHundle}>スタート</Button>
                <Button onClick={stopHundle}>ストップ</Button>
            </Center>
        </>
    )
}

export default Presentation