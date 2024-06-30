import {startbutton} from "../../public/speed_meter_script"

const SpeedMeter = () => {
    const speedStart = () => startbutton()
    return (
        <>
            <button id="start-button1" className="btn btn-primary mb-2" onClick={speedStart}>Start</button>
            <div id="console">0.0</div>
            <canvas id="myChart"></canvas>
        </>
    )
}
export default SpeedMeter;