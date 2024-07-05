import {FC, memo, MutableRefObject, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Center, Flex} from '@mantine/core';
import "./Presentation.scss"
import {startbutton, sr} from "../utils/speed_meter_script"
import {SlideResult} from "../global";
import {startAmivoice, stopAmivoice} from "../utils/amivoice.ts";
import { VolumeMeter } from "./VolumeMeter.tsx";

import PdfViewer from "./PdfViewer";
import {pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface Props {
    pdfFile: File;
    presentationTime: string;
    setFillers: React.Dispatch<React.SetStateAction<number[]>>
}

const Presentation: FC<Props> = memo<Props>(({pdfFile, presentationTime, setFillers}) => {
    const navigate = useNavigate();
    const [started, setStarted] = useState(false)
    const [arrSlideResult, setArrSlideResult] = useState<SlideResult[]>([])

    let countFastSpeed: MutableRefObject<number> = useRef(0)
    let countVariable: MutableRefObject<number> = useRef(0);
    let countAll: MutableRefObject<number> = useRef(0);
    let slideStartTime: MutableRefObject<number> = useRef(0)
    let countPercentage: MutableRefObject<number> = useRef(0)
    let elapsedTime: MutableRefObject<number> = useRef(0)

    const webgazer = window.webgazer;
    useEffect(() => {
        webgazer
            .setGazeListener((data: any) => {
                data.y < 300 && ++countVariable.current;
                ++countAll.current;
                sr > 4 && ++countFastSpeed.current;
            })
            .begin();
        startbutton()
    }, [])

    const startHandle = () => {
        countVariable.current = 0;
        countAll.current = 0;
        countFastSpeed.current = 0;
        slideStartTime.current = Number(new Date());
        setStarted(true)
        startAmivoice()
    }

    const slideHandle = () => {
        countPercentage.current = Math.floor((countVariable.current * 100) / countAll.current);
        elapsedTime.current = Number(new Date()) - slideStartTime.current;
        const resultObj = {
            countPercentage: countPercentage.current,
            elapsedTime: elapsedTime.current,
            countFastSpeed: Math.floor((countAll.current - countFastSpeed.current) * 100 / countAll.current)
        }
        setArrSlideResult(prev => [...prev, resultObj])
        stopAmivoice(setFillers)
        startAmivoice()

        countVariable.current = 0;
        countAll.current = 0;
        countFastSpeed.current = 0;
        slideStartTime.current = Number(new Date());
    }

    const stopHandle = () => {
        countPercentage.current = Math.floor((countVariable.current * 100) / countAll.current);
        elapsedTime.current = Number(new Date()) - slideStartTime.current;

        stopAmivoice(setFillers)

        webgazer.pause()
        webgazer.end();
        console.log(arrSlideResult);
        navigate("/result", {
            state: [...arrSlideResult,
                {
                    countPercentage: countPercentage.current,
                    elapsedTime: elapsedTime.current,
                    countFastSpeed: Math.floor((countAll.current - countFastSpeed.current) * 100 / countAll.current)
                }
            ]
        })
    }


    return (
        <>
            <Flex justify="flex-end">
                {started ? (<Button onClick={stopHandle}>ストップ</Button>) : (
                    <Button onClick={startHandle}>スタート</Button>)}
                <p>{presentationTime}</p>
                <div className='chart-container'>
                    <canvas id="myChart"></canvas>
                </div>
            </Flex>
            {/*<Progress value={} w="500px"/>*/}
                <VolumeMeter/>
                {/*<div style={{border: "1px solid black", width: "500px"}}>*/}
                {/*    <div id="volume" style={{height: "10px", background: "black", transition: "width .1s", width: "0%"}}></div>*/}
                {/*</div>*/}
            <Center>
                <PdfViewer file={pdfFile} slideHandle={slideHandle} started={started}/>
            </Center>
        </>
    )
})

export default Presentation