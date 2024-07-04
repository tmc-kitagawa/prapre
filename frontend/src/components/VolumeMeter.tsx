import {FC, useState, useEffect} from "react";
import {Progress} from "@mantine/core"

const bufferSize = 1024;
let audioContext: null | AudioContext = null

export const VolumeMeter: FC = () => {
    const [percent, setPercent] = useState(0)

    const onAudioProcess = function (e: any) {
        const input = e.inputBuffer.getChannelData(0);

        // volume meter用の処理
        const peak = input.reduce((max: number, sample: number) => {
            const cur = Math.abs(sample);
            return max > cur ? max : cur;
        });
        const percent = 100 / 24 * 10 * Math.log10(peak) + 100
        setPercent(percent)
        // render(100 / 32 * 10 * Math.log10(peak) + 100);
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

    return (
        <>
            <Progress value={percent} w="200px"/>
        </>
    )
}