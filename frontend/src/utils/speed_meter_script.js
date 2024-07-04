// import "https://code.jquery.com/jquery-3.4.1.slim.min.js"
// with {
//         integrity:"sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n",
//         // crossOrigin:"anonymous"
//         }
// import "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
// with {
//         integrity:"sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo",
//         // crossOrigin:"anonymous"
//         }
// import "https://obniz.io/js/jquery-3.2.1.min.js"
// import "../public/jquery-3.2.1.min.js"
// import "./popper.min.js"
//
// import  "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
// with {
// integrity : "sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6",
// crossorigin : "anonymous"
// > < /script>    <script src="https:/
//         }
// /obniz.io/
// js / jquery - 3.2
// .1.min.js
// "></script>

// import "https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"
// import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"
// import "https://cdn.jsdelivr.net/npm/moment@2.24.0/min/moment.min.js"
// import "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
// import "https://cdn.jsdelivr.net/npm/chartjs-plugin-streaming@1.8.0"
import exp from "node:constants";

export function changeValue(value) {
    document.getElementById("val").innerHTML = value;
    fireCount = value;
}

//eruda.init();

// sound effect from https://maoudamashii.jokersounds.com/list/se2.html
//let sound;
let sound = new Audio("https://qurihara.github.io/speechrate/sound/se_maoudamashii_onepoint13.mp3");
//let sound; //= new Audio("https://rawgit.com/Fulox/FullScreenMario-JSON/master/Sounds/Sounds/mp3/Coin.mp3");
let modelLoaded = false;

// 変数定義
let localMediaStream = null;
let localScriptProcessor = null;
let audioContext;// = new AudioContext();
let audioData = []; // 録音データ
let buf;
let buf_cb;

let model;
let modelname = '';
let bufferSize = 1024;
let fft_frames = bufferSize;
let fftSize = bufferSize / 2;
let predictCount = 20;
let divOffset = 100;

let model_cb;
let modelname_cb = '';
let bufferSize_cb = 1024;
let fft_frames_cb = bufferSize_cb;
let fftSize_cb = bufferSize_cb / 2;
let predictCount_cb = 20;
let divOffset_cb = 100;


let fireCount = 7;
let sr = 0; //瞬間値
let wfurl = "";
let alerting = false;

// キャンバス
let canvas = document.getElementById('canvas');
let canvasContext = canvas?.getContext('2d');

// 音声解析
let audioAnalyser = null;

$("#clear-button").click(function clear() {
    location.reload();
});

//-----------------------
// start button event
//-----------------------

// $("#start-button1").click(function () {
export function startbutton() {
// 	modelname = 'https://qurihara.github.io/crosstalk-breaker/191218_sr_s/model-reg/';
    modelname = 'https://qurihara.github.io/speechrate/models/191222_60/model-reg/';
    modelname_cb = 'https://qurihara.github.io/speechrate/models/191212_hard/model-class/';
    loadModel(tf.loadLayersModel);

    bufferSize = 1024;
    fftSize = bufferSize / 8;//4;
    predictCount = 60;
    divOffset = 125.55546;

    bufferSize_cb = 1024;
    fftSize_cb = bufferSize_cb / 4;
    predictCount_cb = 20;
    divOffset_cb = 120;

    let ctx = document.getElementById('myChart').getContext('2d');
    window.myChart = new Chart(ctx, config);
    // const len = config.data.datasets[0].data.length;
    console.log(config.data.datasets[0].data);

};

// $("#start-buttonTest").click(function () {
//     onfire();
// });


//-----------------------
// load model
//-----------------------

export async function loadModel(loadf) {
    let modelfile = modelname + 'model.json';
    console.log("model loading.. : " + modelfile);
    $("#warning").html(`model loading...`);
    model = await loadf(modelfile);

    let modelfile_cb = modelname_cb + 'model.json';
    console.log("model loading.. : " + modelfile_cb);
    model_cb = await loadf(modelfile_cb);


    console.log("model loaded.");
    $("#warning").html(modelname + ' loaded.');
    modelLoaded = true;

    init_tfjs();
};


export function init_tfjs() {
    buf = tf.buffer([fftSize, predictCount]);
    buf_cb = tf.buffer([fftSize_cb, predictCount_cb]);

    //hot start
    const mat = buf.toTensor().expandDims().expandDims(-1);
    predict(mat);
    mat.dispose();
    const mat_cb = buf_cb.toTensor().expandDims().expandDims(-1);
    predict_cb(mat_cb);
    mat_cb.dispose();

    startWebcam();
}

let qCount = 10;
let que = [];//0,0,0,0,0];
export function enqueue(n) {
    que.push(n);
    if (que.length > qCount) {
        que.shift();
    }
}

export function average() {
    if (que.length == 0) return 0.0;
    let a = 0.0;
    for (let i = 0; i < que.length; i++) {
        a = a + que[i];
    }
    a = a / que.length;
    return a;
}


let qCount_cb = 3;
let que_cb = [];//0,0,0,0,0];
export function enqueue_cb(n) {
    que_cb.push(n);
    if (que_cb.length > qCount_cb) {
        que_cb.shift();
    }
}

export function average_cb() {
    if (que_cb.length == 0) return 0.0;
    let a = 0.0;
    for (let i = 0; i < que_cb.length; i++) {
        a = a + que_cb[i];
    }
    a = a / que_cb.length;
    return a;
}

//-----------------------
// TensorFlow.js method
// predict tensor
//-----------------------

export async function predict(tensor) {
    let cb = average_cb()
//   console.log(cb);
    sr = 0.0;
    if (cb < 1) {
        //do nothing
    } else {
        let prediction = await model.predict(tensor).data();
        sr = prediction[0];
    }
    enqueue(sr);
    $("#console").empty();
    $("#console2").empty();
    $("#console").append(`${Math.round(sr * 10) / 10}`);
    // console.log(Math.round(sr * 10) / 10)
    $("#console2").append(`${Math.round(average() * 10) / 10}`);
    if (average() >= fireCount) {
        onfire();
    }
    if (cb > 1) {
        console.log("noisy");
    }
};

export function onfire() {
    if (alerting == true) {
        console.log("still alerting");
        return;
    }
    alerting = true;
    $("#all").css('background-color', 'red');
    if (wfurl != '') {
        $.get(wfurl);
//       console.log("webhook");
    }

    let mute = $("#mute").prop("checked");
    if (mute == false) {
        if (sound) {
            sound.play();
        }
    }

    setTimeout(function () {
        $("#all").css('background-color', 'white');
        alerting = false;
    }, 1000);
}

export async function predict_cb(tensor) {
    let prediction = await model_cb.predict(tensor).data();
    let results = Array.from(prediction)
        .map(function (p, i) {
            return {
                probability: p,
                expectation: p * i,
                num: i
            };
        }).sort(function (a, b) {
            return b.probability - a.probability;
        });
    let cb = results[0].num;
    enqueue_cb(cb);
//   console.log(cb);
};


let counter = 0;
let counter_cb = 0;

export function get_fft(dat) {
    const fft_cb = tf.tidy(() => {
        let offset = tf.scalar(divOffset_cb);
        let fft = tf.signal.stft(tf.tensor1d(dat), fft_frames_cb, bufferSize_cb).abs().div(offset).flatten().slice(0, fftSize_cb);
        //    console.log(fft.shape);
        return fft.dataSync();
    });
    for (let i = 0; i < fftSize_cb; i++) buf_cb.set(fft_cb[i], i, counter_cb);
    counter_cb++;
    if (counter_cb == predictCount_cb) {
        const mat_cb = buf_cb.toTensor().expandDims().expandDims(-1);
        predict_cb(mat_cb);
        mat_cb.dispose();
    }
    if (counter_cb == predictCount_cb) counter_cb = 0;
    const fft = tf.tidy(() => {
        let offset = tf.scalar(divOffset);
        let fft = tf.signal.stft(tf.tensor1d(dat), fft_frames, bufferSize).abs().div(offset).flatten().slice(0, fftSize);
        //    console.log(fft.shape);
        return fft.dataSync();
    });
    for (let i = 0; i < fftSize; i++) buf.set(fft[i], i, counter);
    counter++;
    if (counter == predictCount) {
        const mat = buf.toTensor().expandDims().expandDims(-1);
        predict(mat);
        mat.dispose();
    }
    if (counter == predictCount) counter = 0;

}


//-----------------------
// start webcam
//-----------------------

let audio = {};
// let acontext;// = new AudioContext();
let mediaStream;

let recordingFlg = false;

export function startWebcam() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();//new AudioContext();
    recordingFlg = true;
    console.log("mic start.");
// 	$("#console2").html(`mic start.`);
    $("#warning").empty();

// 	// Older browsers might not implement mediaDevices at all, so we set an empty object first
// 	if (navigator.mediaDevices === undefined) {
// 		navigator.mediaDevices = {};
// 	}

// 	// Some browsers partially implement mediaDevices. We can't just assign an object
// 	// with getUserMedia as it would overwrite existing properties.
// 	// Here, we will just add the getUserMedia property if it's missing.
// 	if (navigator.mediaDevices.getUserMedia === undefined) {
// 		navigator.mediaDevices.getUserMedia = function(constraints) {

// 			// First get ahold of the legacy getUserMedia, if present
// 			let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// 			// Some browsers just don't implement it - return a rejected promise with an error
// 			// to keep a consistent interface
// 			if (!getUserMedia) {
// 				return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
// 			}

// 			// Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
// 			return new Promise(function(resolve, reject) {
// 				getUserMedia.call(navigator, constraints, resolve, reject);
// 			});
// 		}
// 	}

    navigator.mediaDevices_ = navigator.mediaDevices_ || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
        getUserMedia: function (c) {
            return new Promise(function (y, n) {
                (navigator.mozGetUserMedia ||
                    navigator.webkitGetUserMedia).call(navigator, c, y, n);
            });
        }
    } : null);

    if (!navigator.mediaDevices_) {
        alert("getUserMedia() not supported.");
        console.log("getUserMedia() not supported.");
        return;
    }

    navigator.mediaDevices_.getUserMedia({audio: true, video: false})
        .then(function (stream) {
            // 録音関連
            localMediaStream = stream;
            let scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
            localScriptProcessor = scriptProcessor;
            let mediastreamsource = audioContext.createMediaStreamSource(stream);
            mediastreamsource.connect(scriptProcessor);
            scriptProcessor.onaudioprocess = onAudioProcess;
            scriptProcessor.connect(audioContext.destination);

            // 音声解析関連
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 2048;
            let frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
            let timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
            mediastreamsource.connect(audioAnalyser);

        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });

}

export function onAudioProcess(e) {
    if (!recordingFlg) return;

    let input = e.inputBuffer.getChannelData(0);
//     console.log("samplerate : " + e.inputBuffer.sampleRate + " ,length : " + e.inputBuffer.length + " ,duration : " + e.inputBuffer.duration);
    let bufferData = new Float32Array(bufferSize);
    for (let i = 0; i < bufferSize; i++) {
        bufferData[i] = input[i];
    }

    if (modelLoaded == true) {
        get_fft(bufferData);
    }

    waCounter++;
    if (waCounter % waCountFrq == 0) {
        // 波形を解析
        analyseVoice();
        waCounter = 0;
    }
};
let waCounter = 0;
let waCountFrq = 3;

// 解析用処理
export function analyseVoice() {
    let fsDivN = audioContext.sampleRate / 2 / audioAnalyser.fftSize;
    let spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(spectrums);
    // canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // canvasContext.beginPath();

    for (let i = 0, len = spectrums.length; i < len; i++) {
        //canvasにおさまるように線を描画
        // let x = (i / len) * canvas.width;
        // let y = (1 - (spectrums[i] / 255)) * canvas.height;
        if (i === 0) {
            // canvasContext.moveTo(x, y);
        } else {
            // canvasContext.lineTo(x, y);
        }
//         let f = Math.floor(i * fsDivN);  // index -> frequency;
//         // 500 Hz単位にy軸の線とラベル出力
//         if ((f % 500) === 0) {
//             let text = (f < 1000) ? (f + ' Hz') : ((f / 1000) + ' kHz');
//             // Draw grid (X)
//             canvasContext.fillRect(x, 0, 1, canvas.height);
//             // Draw text (X)
//             canvasContext.fillText(text, x, canvas.height);
//         }
    }

    // canvasContext.stroke();

//     // x軸の線とラベル出力
//     let textYs = ['1.00', '0.50', '0.00'];
//     for (let i = 0, len = textYs.length; i < len; i++) {
//         let text = textYs[i];
//         let gy   = (1 - parseFloat(text)) * canvas.height;
//         // Draw grid (Y)
//         canvasContext.fillRect(0, gy, canvas.width, 1);
//         // Draw text (Y)
//         canvasContext.fillText(text, 0, gy);
//     }
}


//chart
let chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

export function onRefresh(chart) {
    chart.config.data.datasets[0].data.push({
        x: Date.now(),
        y: sr
    });
    // chart.config.data.datasets[1].data.push({
    //     x: Date.now(),
    //     y: average()
    // });
    chart.config.data.datasets[2].data.push({
        x: Date.now(),
        y: fireCount
    });
}

let color = Chart.helpers.color;
let config = {
    type: 'line',
    data: {
        datasets: [{
            label: '瞬間値',
            backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
            borderColor: chartColors.blue,
            fill: false,
            borderDash: [8, 4],
            cubicInterpolationMode: 'monotone',
            data: []
        }, {
            label: '',//平均値
            backgroundColor: color(chartColors.green).alpha(0).rgbString(),
            borderColor: 'rgb(255,255,255)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }, {
            label: '閾値',
            backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
            borderColor: chartColors.red,
            fill: false,
            lineTension: 0,
            data: []
        }]
    },
    options: {
// 		title: {
// 			display: true,
// 			text: 'Speech rate'
// 		},
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 1000,
                    onRefresh: onRefresh
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'かな/秒'
                }
            }]
        },
        tooltips: {
            mode: 'nearest',
            intersect: false
        },
        hover: {
            mode: 'nearest',
            intersect: false
        },
        maintainAspectRatio: false
    }
};

//

window.onload = function () {
    let cookie = $.cookie('webhookurl');
    if (cookie) {
        console.log(cookie);
        $('#webhookurl').val(cookie);
    } else {
//     console.log("no cookie");
    }

}
$("#webhookbutton").click(function () {
    wfurl = $('#webhookurl').val()
    console.log(wfurl);
    if (wfurl != '') {
        $.cookie('webhookurl', wfurl);
    } else {
        console.log("no url");
    }
    $('#webhookurl').prop('disabled', true);
    $('#webhookbutton').prop('disabled', true);
});

export {sr};