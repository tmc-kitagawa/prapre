import axios from "axios";

let audio_sample_rate: number;
let audioData: Float32Array[] = [];
const bufferSize = 1024;
let audioContext: null | AudioContext = null

const exportWAV = function (audioData: Float32Array[], setFillers:  React.Dispatch<React.SetStateAction<number[]>>) {

    const encodeWAV = function (samples:  Float32Array, sampleRate: number) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        const writeString = function (view:  DataView, offset: number, string: string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        const floatTo16BitPCM = function (output: DataView, offset: number, input:  Float32Array) {
            for (let i = 0; i < input.length; i++ , offset += 2) {
                let s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };

        writeString(view, 0, 'RIFF');  // RIFFヘッダ
        view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
        writeString(view, 8, 'WAVE'); // WAVEヘッダ
        writeString(view, 12, 'fmt '); // fmtチャンク
        view.setUint32(16, 16, true); // fmtチャンクのバイト数
        view.setUint16(20, 1, true); // フォーマットID
        view.setUint16(22, 1, true); // チャンネル数
        view.setUint32(24, sampleRate, true); // サンプリングレート
        view.setUint32(28, sampleRate * 2, true); // データ速度
        view.setUint16(32, 2, true); // ブロックサイズ
        view.setUint16(34, 16, true); // サンプルあたりのビット数
        writeString(view, 36, 'data'); // dataチャンク
        view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
        floatTo16BitPCM(view, 44, samples); // 波形データ

        return view;
    };

    const mergeBuffers = function (audioData: Float32Array[]) {
        let sampleLength = 0;
        for (let i = 0; i < audioData.length; i++) {
            sampleLength += audioData[i].length;
        }
        const samples = new Float32Array(sampleLength);
        let sampleIdx = 0;
        for (let i = 0; i < audioData.length; i++) {
            for (let j = 0; j < audioData[i].length; j++) {
                samples[sampleIdx] = audioData[i][j];
                sampleIdx++;
            }
        }
        return samples;
    };

    let dataview = encodeWAV(mergeBuffers(audioData), audio_sample_rate);
    let audioBlob = new Blob([dataview], { type: 'audio/wav' });

    const data = new FormData();
    // data.append("d", "grammarFileNames=-a-general keepFillerToken=1 sentimentAnalysis=True");
    data.append("d", "grammarFileNames=-a-general keepFillerToken=1");
    data.append("u", import.meta.env.VITE_API_KEY);
    data.append("a", audioBlob);
    axios.post('https://acp-api.amivoice.com/v1/recognize', data).then(res => {
        console.log(res.data)
        const count = (res.data.text.match(/\%/g) || []).length / 2;
        setFillers(prev => [...prev, count])
    })
};

const onAudioProcess = function (e: any) {
    const input = e.inputBuffer.getChannelData(0);
    const bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
        bufferData[i] = input[i];
    }

    audioData.push(bufferData);
};

const handleSuccess = function (stream: any) {
    audioContext = new AudioContext();
    audio_sample_rate = audioContext.sampleRate;
    const scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    const mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    console.log('record start');

};

export const startAmivoice = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
}

export const stopAmivoice = (setFillers:  React.Dispatch<React.SetStateAction<number[]>>) => {
    exportWAV(audioData, setFillers)
    audioContext?.close()
    audioData=[]
}