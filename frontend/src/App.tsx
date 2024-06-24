import axios, { AxiosResponse, AxiosError } from "axios";
import {Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Calibration from "./components/Calibration";
import Presentation from "./components/Presentation";
import Result from "./components/Result";

interface Presentation {
    id: number;
    title: String;
    starttime: number;
    user_id: number;
}

const App = () => {

    axios("/api/presentations")
        .then((res: AxiosResponse<Presentation[]>) =>
            console.log(res.data)
            )
        .catch((e: AxiosError<{ error: string }>) => {
            console.log(e.message);
        });

  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="calibration" element={<Calibration />} />
        <Route path="presentation" element={<Presentation />} />
        <Route path="result" element={<Result />} />
        {/*<Route path="/history" element={<History />} />*/}
    </Routes>
  )
}

export default App
