import {FC, useEffect} from "react";
import "./Calibration.scss";
import {Restart} from "../utils/main"

const Calibration: FC = () => {

    useEffect(() => {
        const webgazer = window.webgazer;

        webgazer.setRegression('ridge') /* currently must set regression and tracker */
            //.setTracker('clmtrackr')
            .setGazeListener(function(data, clock) {
                  console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                  console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            })
            .saveDataAcrossSessions(true)
            .begin();
        webgazer.showVideoPreview(true) /* shows all video previews */
            .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
            .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

        //Set up the webgazer video feedback.
        var setup = function() {

            //Set up the main canvas. The main canvas is used to calibrate the webgazer.
            var canvas = document.getElementById("plotting_canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.style.position = 'fixed';
        };
        setup();

    }, [])

    return (
        <>
            <canvas id="plotting_canvas" width="500" height="500" style={{cursor: "crosshair"}}></canvas>

            {/*<script src="../../node_modules/sweetalert/dist/sweetalert.min.js" defer></script>*/}

            {/*<script src="../utils/main.js" defer></script>*/}
            {/*<script src="../utils/calibration.js" defer></script>*/}
            {/*<script src="../utils/precision_calculation.js" defer></script>*/}
            {/*<script src="../utils/precision_store_points.js" defer></script>*/}

            {/*<script src="../utils/resize_canvas.js" defer></script>*/}
            {/*<script src="../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" defer></script>*/}

            <h1>Calibrationページです</h1>
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
        </>
    )
}

export default Calibration