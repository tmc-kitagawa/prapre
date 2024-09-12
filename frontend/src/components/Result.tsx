import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SlideResult } from "../global";
import axios from "axios";
import { Loader } from "@mantine/core";
import "@mantine/charts/styles.css";

import { fbComment } from "../utils/FbComment";

import "moment/dist/locale/ja";
import "./Result.scss";

interface Props {
  userId: number | null;
  fillers: number[];
  setFillers: React.Dispatch<React.SetStateAction<number[]>>;
  volumes: number[];
  setVolumes: React.Dispatch<React.SetStateAction<number[]>>;
  presentationTime: string;
  slide: any;
}

const Result: FC<Props> = ({
  userId,
  fillers,
  volumes,
  presentationTime,
  slide,
}) => {
  const [totalScore, setTotalScore] = useState<null | number>(null);
  const [Comment, setComment] = useState<null | string>(null);
  const location = useLocation();

  const totalElapsedMilliSeconds: number = useLocation()
    .state.slideScore.map((obj: SlideResult) => obj.elapsedTime)
    .reduce((acc: number, cur: number) => acc + cur, 0);
  const totalElapsed = Math.floor(totalElapsedMilliSeconds / 1000);
  const timerArr = presentationTime.split(":");
  const targetSeconds = Number(timerArr[0]) * 60 + Number(timerArr[1]);
  const timeScore = Math.max(100 - Math.abs(targetSeconds - totalElapsed), 0);

  const countPages = location.state.slideScore.length;

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
    fillers.reduce((acc: number, cur: number) => acc + cur, 0) / fillers.length
  );

  useEffect(() => {
    while (document.getElementById("webgazerVideoContainer")) {
      document.getElementById("webgazerVideoContainer")!.remove();
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (fillers.length === volumes.length) {
          setTotalScore(
            Math.floor(
              (eyeScore + volumeScore + fillersScore + speedScore + timeScore) /
                5
            )
          );
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
          await axios.post("/api/histories", scoreData);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [fillers, volumes]);

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
      {fillers.length !== countPages ? (
        <Loader color="blue" />
      ) : (
        <>
          <div className="result-wrapper">
            <div className="title-container">
              <h2 className="title">あなたのプレゼンスタイル</h2>
              <p className="presen-style">お喋りマッチョコンサル</p>
            </div>
            <div className="result-container">
              <div className="indicator-wrapper">
                <h3 className="deviation">
                  偏差値 <span className="deviation-value">{totalScore}</span>
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
                    <h4>　話す速度</h4>
                    <p>適切</p>
                  </div>
                  <div className="bar">{showBar(speedScore)}</div>
                </div>
                <div className="indicator-container">
                  <div className="indicator">
                    <p>小さい</p>
                    <h4>　声の大きさ</h4>
                    <p>大きい</p>
                  </div>
                  <div className="bar">{showBar(volumeScore)}</div>
                </div>
                <div className="indicator-container">
                  <div className="indicator">
                    <p>多い</p>
                    <h4>　　繋ぎ言葉</h4>
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
                <img src="/con.svg" alt="" className="img" />
                <div className="comment-container">
                  <p className="comment">{Comment}</p>
                </div>
                <div className="circle">
                  <div className="white-circle"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Result;
