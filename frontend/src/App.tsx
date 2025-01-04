import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Result from "./components/Result";
import {MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';
import {useState} from "react";
import Presentation from "./components/Presentation.tsx";
import { AllResults } from "./components/AllResults.tsx";
import {FileWithPath} from "@mantine/dropzone";

const App = () => {
    const [userId, setUserId] = useState<null | number>(null)
    const [slide, setSlide] = useState<FileWithPath>()
    const [presentationTime, setPresentationTime] = useState("")
    const [fillerScores, setFillerScores] = useState<number[]>([])
    const [fillers, setFillers] = useState<number[][]>([])
    const [volumes, setVolumes] = useState<number[]>([])
    const [numPages, setNumPages] = useState(0)

    return (
        <MantineProvider>
            <Routes>
                <Route path="/" element={<Home setUserId={setUserId} slide={slide} setSlide={setSlide} setPresentationTime={setPresentationTime} setNumPages={setNumPages}/>}/>
                <Route path="presentation" element={<Presentation slide={slide!} presentationTime={presentationTime} setFillerScores={setFillerScores} setVolumes={setVolumes} numPages={numPages} setFillers={setFillers}/>}/>
                <Route path="result" element={<Result userId={userId} fillerScores={fillerScores} volumes={volumes} presentationTime={presentationTime} slide={slide!} fillers={fillers}/>}/>
                <Route path="allresults" element={<AllResults />} />
            </Routes>
        </MantineProvider>
    )
}

export default App
