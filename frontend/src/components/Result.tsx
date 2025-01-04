import {FC, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {SlideResult} from "../global";
import axios from "axios";
import {Loader} from "@mantine/core";
import "@mantine/charts/styles.css";

import {fbComment} from "../utils/FbComment";

import "moment/dist/locale/ja";
import "./Result.scss";
import {getStyle} from "../utils/presenStyle";
import PlayVideo from "./PlayVideo.tsx";
import {FileWithPath} from "@mantine/dropzone";

interface Props {
    userId: number | null;
    fillerScores: number[];
    volumes: number[];
    presentationTime: string;
    slide: FileWithPath;
    fillers: number[][];
}

const Result: FC<Props> = ({
                               userId,
                               fillerScores,
                               volumes,
                               presentationTime,
                               slide,
                               fillers
                           }) => {
    const [Comment, setComment] = useState<string[] | null>(null);
    const [presenStyle, setPresenStyle] = useState<null | string>(null);
    const [deviation, setDeviation] = useState<null | number>(null);
    const [isPlayVideo, setIsPlayVideo] = useState(true)
    const [name, setName] = useState("");
    const location = useLocation();

    const totalElapsedMilliSeconds: number = useLocation()
        .state.slideScore.map((obj: SlideResult) => obj.elapsedTime)
        .reduce((acc: number, cur: number) => acc + cur, 0);
    const totalElapsed = Math.floor(totalElapsedMilliSeconds / 1000);
    const timerArr = presentationTime.split(":");
    const targetSeconds = Number(timerArr[0]) * 60 + Number(timerArr[1]);
    const timeScore = Math.max(100 - Math.abs(targetSeconds - totalElapsed), 0);

    const countPages = location.state.slideScore.length;
    const times: number[] = location.state.slideScore.map((obj: SlideResult) => Math.floor(obj.elapsedTime / 1000))

    const totalEye = location.state.slideScore
        .map((obj: SlideResult) => {
            return obj.countPercentage;
        })
        .reduce((acc: number, cur: number) => acc + cur, 0);

    const eyeScore = Math.floor(totalEye / countPages);

    const totalSpeed = location.state.slideScore
        .map((obj: SlideResult) => {
            return obj.countFastSpeed;
        })
        .reduce((acc: number, cur: number) => acc + cur, 0);

    const speedScore = Math.floor(totalSpeed / countPages);

    const volumeScore = Math.floor(
        volumes.reduce((acc: number, cur: number) => acc + cur, 0) / volumes.length
    );

    const fillersScore = Math.floor(
        fillerScores.reduce((acc: number, cur: number) => acc + cur, 0) / fillerScores.length
    );

    const recordedUrl: string = location.state.recoededUrl

    useEffect(() => {
        while (document.getElementById("webgazerVideoContainer")) {
            document.getElementById("webgazerVideoContainer")!.remove();
        }
    }, []);

    useEffect(() => {
        (async () => {
            try {
                if (fillerScores.length === volumes.length) {
                    const totalScore = Math.floor(
                        (eyeScore + volumeScore + fillersScore + speedScore + timeScore) / 5
                    );
                    const deviation = Math.floor((10 * (totalScore - 60)) / 20 + 50);
                    setDeviation(deviation);
                    const scoreData = {
                        title: slide.name,
                        startTime: location.state.starttime,
                        userId: userId,
                        scoreEye: eyeScore,
                        scoreVolume: volumeScore,
                        scoreFiller: fillersScore,
                        scoreSpeed: speedScore,
                        scoreTime: timeScore,
                    };
                    setComment(fbComment(scoreData));
                    setPresenStyle(getStyle(scoreData, setName));
                    await axios.post("/api/histories", scoreData);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [fillerScores, volumes]);

    const showBar = (score: number) => {
        const idx = score === 100 ? 9 : Math.floor(score / 10);
        return [...Array(10)].map((_, i) => {
            if (i === idx) {
                return (
                    <div
                        style={{
                            backgroundColor: "#FE8C8C",
                            width: "3vw",
                            height: "20px",
                            borderRadius: "5px",
                        }}
                    ></div>
                );
            } else {
                return (
                    <div
                        style={{
                            backgroundColor: "#A9A9A9",
                            width: "3vw",
                            height: "20px",
                            borderRadius: "5px",
                        }}
                    ></div>
                );
            }
        });
    };

    return (
        <>
            {fillerScores.length !== countPages &&
                <Loader color="blue"/>
            }
            {fillerScores.length === countPages && isPlayVideo && (
                <>
                    <PlayVideo url={recordedUrl} slide={slide} countPages={countPages} times={times}
                               totalElapsed={totalElapsed} fillers={fillers}/>
                    <button onClick={() => setIsPlayVideo(false)}>詳細分析</button>
                </>
            )}
            {fillerScores.length === countPages && !isPlayVideo &&
                <>
                    <button onClick={() => setIsPlayVideo(true)}>録画確認</button>
                    <div className="result-wrapper">
                        <div className="title-container">
                            <h2 className="title">あなたのプレゼンスタイル</h2>
                            <p className="presen-style">{presenStyle}</p>
                        </div>
                        <div className="result-container">
                            <div className="indicator-wrapper">
                                <h3 className="deviation">
                                    偏差値 <span className="deviation-value">{deviation}</span>
                                </h3>
                                <div className="indicator-container">
                                    <div className="indicator">
                                        <p>できていない</p>
                                        <h4>カメラ目線</h4>
                                        <p>できている</p>
                                    </div>
                                    <div className="bar">{showBar(eyeScore)}</div>
                                </div>
                                <div className="indicator-container">
                                    <div className="indicator">
                                        <p>早い</p>
                                        <h4> 話す速度</h4>
                                        <p>適切</p>
                                    </div>
                                    <div className="bar">{showBar(speedScore)}</div>
                                </div>
                                <div className="indicator-container">
                                    <div className="indicator">
                                        <p>小さい</p>
                                        <h4> 声の大きさ</h4>
                                        <p>大きい</p>
                                    </div>
                                    <div className="bar">{showBar(volumeScore)}</div>
                                </div>
                                <div className="indicator-container">
                                    <div className="indicator">
                                        <p>多い</p>
                                        <h4> 繋ぎ言葉</h4>
                                        <p>少ない</p>
                                    </div>
                                    <div className="bar">{showBar(fillersScore)}</div>
                                </div>
                                <div className="indicator-container">
                                    <div className="indicator">
                                        <p>不適切</p>
                                        <h4>時間</h4>
                                        <p>適切</p>
                                    </div>
                                    <div className="bar">{showBar(timeScore)}</div>
                                </div>
                            </div>
                            <div className="fb-area">
                                <img src={`/${name}.png`} alt="" className={`img ${name}`}/>
                                <div className="comment-container">
                                    {Comment?.map((comment, idx: number) =>
                                        idx === 0 ? (
                                            <p className="good-comment">{comment}</p>
                                        ) : (
                                            <p className="bad-comment">{comment}</p>
                                        )
                                    )}
                                </div>
                                <div className="circle">
                                    <div className="white-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default Result;
