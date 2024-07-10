import React, {useEffect, useState, memo, MutableRefObject, useRef, useCallback} from "react";
import "./Presentation.scss";
import {Restart} from "../utils/main"
import {useNavigate} from "react-router-dom";
import {docLoad} from "../utils/calibration";
import {startbutton, sr} from "../utils/speed_meter_script"
import {SlideResult} from "../global";
import {startAmivoice, stopAmivoice} from "../utils/amivoice";
import {VolumeMeter} from "./VolumeMeter";
import Timer from "./Timer";
import {PointCalibrate} from "../utils/calibration"

import PdfViewer from "./PdfViewer";
import {pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {Flex, Box, Group, ActionIcon, Progress, Center} from '@mantine/core'
import {FaRegPlayCircle, FaRegStopCircle} from "react-icons/fa"

declare global {
    interface Window {
        webgazer: any
    }
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface Props {
    slide: File;
    presentationTime: string;
    setFillers: React.Dispatch<React.SetStateAction<number[]>>
    setVolumes: React.Dispatch<React.SetStateAction<number[]>>
}

interface ChangePageHandle {
    changePage(arg: number): void;
}


const Calibration = memo<Props>(({slide, presentationTime, setFillers, setVolumes}) => {
    const navigate = useNavigate()
    const [calibrated, setCalibrated] = useState(false)
    const [started, setStarted] = useState(false)
    const [arrSlideResult, setArrSlideResult] = useState<SlideResult[]>([])
    const [slided, setSlided] = useState(false)
    const [end, setEnd] = useState(false)
    const [yellowPoints, setYellowPoints] = useState(PointCalibrate)

    let countFastSpeed: MutableRefObject<number> = useRef(0)
    let countVariable: MutableRefObject<number> = useRef(0);
    let countAll: MutableRefObject<number> = useRef(0);
    let slideStartTime: MutableRefObject<number> = useRef(0)
    let countPercentage: MutableRefObject<number> = useRef(0)
    let elapsedTime: MutableRefObject<number> = useRef(0)
    let startUnixTime: MutableRefObject<number> = useRef(0)
    const pdfViewerRef = useRef<ChangePageHandle>(null)

    const webgazer = window.webgazer;

    const keyDownEvent = useCallback ((event: any) => {
        if (event.key === 'ArrowDown' || event.key === ' ' || event.key === 'Enter' || event.key === 'ArrowRight') {
            pdfViewerRef.current?.changePage(1)
        }
    },[])

    const startEnterEvent = useCallback((event:any) => {
        if (event.key === 'Enter') {
            setStarted(true)
        }
    }, [])

    useEffect(() => {
        docLoad(setCalibrated);

        webgazer.setRegression('ridge') /* currently must set regression and tracker */
            .setGazeListener(function (data: any) {
                if (data) {
                    data.y < 300 && ++countVariable.current;
                    ++countAll.current;
                    sr >= 7.25 && ++countFastSpeed.current;
                }
            })
            .saveDataAcrossSessions(true)
            .begin();

        //Set up the webgazer video feedback.
        var setup = function () {
            //Set up the main canvas. The main canvas is used to calibrate the webgazer.
            var canvas: any = document.getElementById("plotting_canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
        };
        setup();
    }, [])

    useEffect(() => {
        if (calibrated) {
            startbutton()
            window.addEventListener("keydown", startEnterEvent)
        }
    }, [calibrated]);

    useEffect(() => {
        if (started) {
            countVariable.current = 0;
            countAll.current = 0;
            countFastSpeed.current = 0;
            slideStartTime.current = Number(new Date());
            startUnixTime.current = Number(new Date());
            startAmivoice()

            window.removeEventListener('keydown', startEnterEvent)
            window.addEventListener('keydown', keyDownEvent)
        }

    }, [started]);

    useEffect(() => {
        if (end && !slided) {
            navigate("/result", {state: {slideScore: arrSlideResult, starttime: startUnixTime.current}})
        }
    }, [end, slided]);

    const slideHandle = () => {
        setSlided(true)
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
        setSlided(true)
        countPercentage.current = Math.floor((countVariable.current * 100) / countAll.current);
        elapsedTime.current = Number(new Date()) - slideStartTime.current;
        stopAmivoice(setFillers)

        webgazer.pause()
        webgazer.end()

        setEnd(true)

        const resultObj = {
            countPercentage: countPercentage.current,
            elapsedTime: elapsedTime.current,
            countFastSpeed: Math.floor((countAll.current - countFastSpeed.current) * 100 / countAll.current)
        }
        setArrSlideResult(prev => [...prev, resultObj])
        window.removeEventListener('keydown', keyDownEvent)
    }

    const yellowPointHandle = () => {
        if (PointCalibrate !== yellowPoints) {
            setYellowPoints(PointCalibrate)
        }
    }

    return (
        <>
            <canvas id="plotting_canvas" width="500" height="500" style={{cursor: "crosshair"}}></canvas>
            <nav id="webgazerNavbar" className="navbar navbar-expand-lg navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggler" data-toggle="collapse"
                                data-target="#myNavbar">
                            <span className="navbar-toggler-icon">Menu</span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li id="Accuracy"><a>Not yet Calibrated</a></li>
                            {/*<li><a onClick="Restart()" href="#">Recalibrate</a></li>*/}
                            {/*<li><a onClick="webgazer.applyKalmanFilter(!webgazer.params.applyKalmanFilter)" href="#">Toggle*/}
                            {/*    Kalman Filter</a></li>*/}
                            {/*<Center>*/}
                            {/*    <FaRegPlayCircle size="150px" onClick={() => {*/}
                            {/*        console.log("startされました")*/}
                            {/*    }}/>*/}
                            {/*</Center>*/}
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {/*<li><a className="helpBtn" onClick="helpModalShow()" href="#"><span*/}
                            {/*    className="glyphicon glyphicon-cog"></span> Help</a></li>*/}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="calibrationDiv">
                <input type="button" className="Calibration" id="Pt1" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt2" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt3" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt4" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt5" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt6" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt7" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt8" onClick={yellowPointHandle}></input>
                <input type="button" className="Calibration" id="Pt9" onClick={yellowPointHandle}></input>
            </div>

            <div id="helpModal" className="modal fade" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-body">
                            <img src="/calibration.png" width="100%" height="100%"
                                 alt="webgazer demo instructions"></img>
                        </div>
                        <div className="modal-footer">
                            <button id="closeBtn" type="button" className="btn btn-default"
                                    data-bs-dismiss="modal">Close & load saved model
                            </button>
                            <button type="button" id='start_calibration' className="btn btn-primary"
                                    data-bs-dismiss="modal" onClick={() => Restart()}>Calibrate
                            </button>
                        </div>
                    </div>

                </div>
            </div>


            {calibrated ?
                <>
                    <Flex direction="column">
                        <Group justify="space-between">
                            <Flex direction="column">
                                <Box h="170" w="200px"/>
                                <VolumeMeter setVolumes={setVolumes} started={started} slided={slided}
                                             setSlided={setSlided}/>
                            </Flex>

                            {started ?
                                <ActionIcon variant="subtle" size="100px" radius="50px">
                                    <FaRegStopCircle size="100px" onClick={() => {
                                        stopHandle()
                                    }}/>
                                </ActionIcon>
                                :
                                <ActionIcon variant="subtle" size="100px" radius="50px">
                                    <FaRegPlayCircle size="100px" onClick={() => {
                                        setStarted(true)
                                    }}/>
                                </ActionIcon>
                            }
                            <Timer presentationTime={presentationTime} started={started} />
                            <div style={{width: "500px", height: "200px"}} className='chart-container'>
                                <canvas id="myChart"></canvas>
                            </div>
                        </Group>
                        {/*<Center>*/}
                        {/*    {!started ?*/}
                        {/*        <p>再生ボタンをクリックするか、Enterキーを押して、練習を開始してください。</p>*/}
                        {/*        :*/}
                        {/*        (<div>*/}
                        {/*            <p>ページをクリックするか、右矢印／下矢印／Enterキー／スペースキーを押すと、ページをめくれます。</p>*/}
                        {/*            <p>停止ボタンをクリックすると、練習を終了して結果画面に移動します。</p>*/}
                        {/*        </div>)*/}
                        {/*    }*/}
                        {/*</Center>*/}
                        <PdfViewer ref={pdfViewerRef} file={slide} slideHandle={slideHandle} started={started}/>
                    </Flex>

                </>
                :
                <Center>
                    <Progress value={ yellowPoints * 100 / 9 } w="1000px" />
                </Center>}
        </>
    );
})

export default Calibration