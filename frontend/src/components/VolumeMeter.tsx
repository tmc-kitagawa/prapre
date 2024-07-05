import {FC, useEffect, Dispatch, SetStateAction, MutableRefObject, useRef, useState} from "react";
import {Progress} from "@mantine/core"

const bufferSize = 1024;
let audioContext: null | AudioContext = null

interface props {
    started: boolean,
    slided: boolean,
    setSlided: Dispatch<SetStateAction<boolean>>
    setVolumes: Dispatch<SetStateAction<number[]>>
}

export const VolumeMeter: FC<props> = ({started, slided, setSlided, setVolumes}) => {
    const [percent, setPercent] = useState(0)
    let countSmallVolume: MutableRefObject<number> = useRef(0)
    let countBigVolume: MutableRefObject<number> = useRef(0)

    const onAudioProcess = function (e: any) {
        const input = e.inputBuffer.getChannelData(0);

        // volume meter用の処理
        const peak = input.reduce((max: number, sample: number) => {
            const cur = Math.abs(sample);
            return max > cur ? max : cur;
        });
        const percent = 100 / 24 * 10 * Math.log10(peak) + 100
        setPercent(percent)
    };

    const handleSuccess = function (stream: any) {
        audioContext = new AudioContext();
        const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
        const mediastreamsource = audioContext.createMediaStreamSource(stream);
        mediastreamsource.connect(scriptProcessor);
        scriptProcessor.onaudioprocess = onAudioProcess;
        scriptProcessor.connect(audioContext.destination);

        console.log('record start');

    };

    const startVolumeMeter = () => {
        navigator.mediaDevices.getUserMedia({audio: true, video: false})
            .then(handleSuccess);
    }

    useEffect(() => {
        startVolumeMeter()
    }, []);

    useEffect(() => {
        if (started) {
            percent >= 10 && percent <= 50 && ++countSmallVolume.current;
            percent > 50 && ++countBigVolume.current;
        }
    }, [percent]);

    useEffect(() => {
        if (slided) {
            if (countSmallVolume.current + countBigVolume.current === 0) {
                setVolumes(prev => [...prev, 0])
            } else {
                setVolumes(prev => [...prev, Math.floor((countBigVolume.current * 100) / (countSmallVolume.current + countBigVolume.current))])
            }
            countBigVolume.current = 0;
            countSmallVolume.current = 0;
            setSlided(false)
        }
    }, [slided]);

    return (
        <>
            <Progress value={percent} w="200px"/>
        </>
    )
}

