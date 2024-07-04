import {useEffect, useState, memo, MutableRefObject, useRef} from "react";
import "./Calibration.scss";
import {Restart} from "../utils/main"
import {useNavigate} from "react-router-dom";
import {docLoad} from "../utils/calibration";
import {startbutton, sr} from "../utils/speed_meter_script"
import {SlideResult} from "../global";
import {startAmivoice, stopAmivoice} from "../utils/amivoice.ts";
import {VolumeMeter} from "./VolumeMeter.tsx";

import PdfViewer from "./PdfViewer";
import {pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {Flex, Box, Button} from '@mantine/core'


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
}

const Calibration = memo<Props>(({slide, presentationTime, setFillers}) => {
    const navigate = useNavigate()
    const [calibrated, setCalibrated] = useState(false)
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
        docLoad(setCalibrated);


        webgazer.setRegression('ridge') /* currently must set regression and tracker */
            .setGazeListener(function (data: any) {
                if (data) {
                    data.y < 300 && ++countVariable.current;
                    ++countAll.current;
                    sr >= 7 && ++countFastSpeed.current;
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
        }
    }, [calibrated]);

    useEffect(() => {
        if (started) {
            countVariable.current = 0;
            countAll.current = 0;
            countFastSpeed.current = 0;
            slideStartTime.current = Number(new Date());
            startAmivoice()
        }

    }, [started]);

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
        webgazer.end()

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
            <canvas id="plotting_canvas" width="500" height="500" style={{cursor: "crosshair"}}></canvas>
            <nav id="webgazerNavbar" className="navbar navbar-expand-lg navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#myNavbar">
                            <span className="navbar-toggler-icon">Menu</span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id="myNavbar">
                        <ul className="nav navbar-nav">
                            <li id="Accuracy"><a>Not yet Calibrated</a></li>
                            {/*<li><a onClick="Restart()" href="#">Recalibrate</a></li>*/}
                            {/*<li><a onClick="webgazer.applyKalmanFilter(!webgazer.params.applyKalmanFilter)" href="#">Toggle*/}
                            {/*    Kalman Filter</a></li>*/}
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {/*<li><a className="helpBtn" onClick="helpModalShow()" href="#"><span*/}
                            {/*    className="glyphicon glyphicon-cog"></span> Help</a></li>*/}
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="calibrationDiv">
                <input type="button" className="Calibration" id="Pt1"></input>
                <input type="button" className="Calibration" id="Pt2"></input>
                <input type="button" className="Calibration" id="Pt3"></input>
                <input type="button" className="Calibration" id="Pt4"></input>
                <input type="button" className="Calibration" id="Pt5"></input>
                <input type="button" className="Calibration" id="Pt6"></input>
                <input type="button" className="Calibration" id="Pt7"></input>
                <input type="button" className="Calibration" id="Pt8"></input>
                <input type="button" className="Calibration" id="Pt9"></input>
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
                                // data-bs-dismiss="modal" onClick={() => console.log("aaa")}>Calibrate
                                    data-bs-dismiss="modal" onClick={() => Restart()}>Calibrate
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {calibrated ?
                <>
                    <Flex direction="column">
                        <Flex justify="space-between">
                            <Flex direction="column">
                                <Box h="170" w="200px"/>
                                <VolumeMeter/>
                            </Flex>
                            <Box>
                                {started ? <Button onClick={() => {
                                    stopHandle()
                                }}>stop</Button> : <Button onClick={() => {
                                    setStarted(true)
                                }}>start</Button>}
                            </Box>
                            <svg xmlns="http://www.w3.org/2000/svg"></svg>
                            {presentationTime}
                            <div style={{width: "500px", height: "200px"}} className='chart-container'>
                                <canvas id="myChart"></canvas>
                            </div>
                        </Flex>
                        <PdfViewer file={slide} slideHandle={slideHandle} started={started}/>
                    </Flex>

                </>
                : null}
        </>
    )
})

export default Calibration