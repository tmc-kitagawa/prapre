import {memo, useEffect, useState} from 'react'

interface Props {
    presentationTime: string;
    started: boolean
}

const Timer = memo<Props>(({presentationTime, started}) => {
    const [remainingTime, setRemainingTime] = useState(presentationTime)

    useEffect(() => {
        if (started) {
            let time = 0
            const timerArr = remainingTime.split(":")
            const targetSeconds = Number(timerArr[0]) * 60 + Number(timerArr[1])
            const id = setInterval(() => {
                time++
                const leftTime = targetSeconds - time
                if (leftTime >= 0) {
                    setRemainingTime(`${String(Math.floor(leftTime / 60)).padStart(2, "0")}:${String(leftTime % 60).padStart(2, "0")}`)
                } else {
                    setRemainingTime(`-${String(Math.floor(-leftTime / 60)).padStart(2, "0")}:${String(-leftTime % 60).padStart(2, "0")}`)
                }
            }, 1000)
            return () => {
                clearInterval(id)
            }
        }
    }, [started]);

    return <p>{remainingTime}</p>
})
export default Timer;