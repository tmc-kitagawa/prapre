import axios, {AxiosResponse, AxiosError} from "axios";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Calibration from "./components/Calibration";
import Presentation from "./components/Presentation";
import Result from "./components/Result";
import {MantineProvider} from "@mantine/core";
import "@mantine/core/styles.css";
import '@mantine/dropzone/styles.css';
import {useEffect, useState} from "react";

interface Presentation {
    id: number;
    title: String;
    starttime: number;
    user_id: number;
}

const App = () => {
    const [pdfFile, setPdfFile] = useState<any>(null)

    useEffect(() => {
        console.log(pdfFile)
    }, [pdfFile])

    axios("/api/presentations")
        .then((res: AxiosResponse<Presentation[]>) =>
            console.log(res.data)

        )
        .catch((e: AxiosError<{ error: string }>) => {
            console.log(e.message);
        });

    return (
        <MantineProvider>
            <Routes>
                <Route path="/" element={<Home setPdfFile={setPdfFile}/>}/>
                <Route path="calibration" element={<Calibration />}/>
                <Route path="presentation" element={<Presentation pdfFile={pdfFile}/>}/>
                <Route path="result" element={<Result/>}/>
                {/*<Route path="/history" element={<History />} />*/}
            </Routes>
        </MantineProvider>
    )
}

export default App
