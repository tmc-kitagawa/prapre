import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Result from "./components/Result";
import {MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';
import {useState} from "react";
import Presentation from "./components/Presentation.tsx";

const App = () => {
    const [userId, setUserId] = useState<null | number>(null)
    const [slide, setSlide] = useState<any>(null)
    const [presentationTime, setPresentationTime] = useState("")
    const [fillers, setFillers] = useState<number[]>([])
    const [volumes, setVolumes] = useState<number[]>([])

    return (
        <MantineProvider>
            <Routes>
                <Route path="/" element={<Home setUserId={setUserId} slide={slide} setSlide={setSlide} setPresentationTime={setPresentationTime}/>}/>
                <Route path="presentation" element={<Presentation slide={slide} presentationTime={presentationTime} setFillers={setFillers} setVolumes={setVolumes}/>}/>
                <Route path="result" element={<Result userId={userId} fillers={fillers} volumes={volumes} presentationTime={presentationTime} slide={slide}/>}/>
            </Routes>
        </MantineProvider>
    )
}

export default App
