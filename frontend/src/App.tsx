import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Calibration from "./components/Calibration";
import Presentation from "./components/Presentation";
import Result from "./components/Result";
import {MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';
import {useState} from "react";

const App = () => {
    const [pdfFile, setPdfFile] = useState<any>(null)
    const [presentationTime, setPresentationTime] = useState("")
    const [fillers, setFillers] = useState<number[]>([])

    return (
        <MantineProvider>
            <Routes>
                <Route path="/" element={<Home setPdfFile={setPdfFile} setPresentationTime={setPresentationTime}/>}/>
                <Route path="calibration" element={<Calibration />}/>
                <Route path="presentation" element={<Presentation pdfFile={pdfFile} presentationTime={presentationTime} setFillers={setFillers}/>}/>
                <Route path="result" element={<Result fillers={fillers}/>}/>
            </Routes>
        </MantineProvider>
    )
}

export default App
