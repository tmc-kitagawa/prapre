import {FC, useEffect} from "react";

const Presentation: FC = () => {

    useEffect(() => {
        const webgazer = window.webgazer;
        webgazer
            .setGazeListener((data, clock) => {
                console.log(data, clock);
            })
            .begin();
    }, [])


    return (
        <>
            <h1>Presentationページです</h1>
        </>
    )
}

export default Presentation