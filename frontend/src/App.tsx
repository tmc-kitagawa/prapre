import axios, { AxiosResponse, AxiosError } from "axios";

interface Presentation {
    id: number;
    title: String;
    starttime: number;
    user_id: number;
}

function App() {

    axios("/api/presentations")
        .then((res: AxiosResponse<Presentation[]>) =>
            console.log(res.data)
            )
        .catch((e: AxiosError<{ error: string }>) => {
            console.log(e.message);
        });

  return (
    <>

    </>
  )
}

export default App
