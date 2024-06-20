import axios from "axios";

function App() {

    axios("/api/presentations").then(res => console.log(res.data))

  return (
    <>

    </>
  )
}

export default App
