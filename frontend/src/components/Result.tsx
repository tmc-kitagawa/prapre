import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SlideResult } from "../global";

import { Flex, Loader, Space } from "@mantine/core";
import "@mantine/charts/styles.css";

import { fbComment } from "../utils/FbComment";

import "moment/dist/locale/ja";

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
          <Flex
            justify="flex-start"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <p>あなたのプレゼンスタイル</p>
            <p>お喋りマッチョコンサル</p>
          </Flex>
          <Flex
            gap="md"
            justify="space-around"
            align="center"
            direction="row"
            wrap="wrap"
          >
            <Flex
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
            >
              <p>偏差値{totalScore}</p>
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Flex w="100%" justify="space-between" direction="row">
                  <p>できていない</p>
                  <p>カメラ目線</p>
                  <p>できている</p>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap="xs">
                  {showBar(eyeScore)}
                </Flex>
              </Flex>
              <Space h="xl" />
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Flex w="100%" justify="space-between" direction="row">
                  <p>早い</p>
                  <p>話す速度</p>
                  <p>適切</p>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap="xs">
                  {showBar(speedScore)}
                </Flex>
              </Flex>
              <Space h="xl" />

              <Flex
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Flex w="100%" justify="space-between" direction="row">
                  <p>小さい</p>
                  <p>声の大きさ</p>
                  <p>大きい</p>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap="xs">
                  {showBar(volumeScore)}
                </Flex>
              </Flex>
              <Space h="xl" />
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Flex w="100%" justify="space-between" direction="row">
                  <p>多い</p>
                  <p>繋ぎ言葉</p>
                  <p>少ない</p>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap="xs">
                  {showBar(fillersScore)}
                </Flex>
              </Flex>
              <Space h="xl" />
              <Flex
                justify="flex-start"
                align="flex-start"
                direction="column"
                wrap="wrap"
              >
                <Flex w="100%" justify="space-between" direction="row">
                  <p>不適切</p>
                  <p>時間</p>
                  <p>適切</p>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap="xs">
                  {showBar(timeScore)}
                </Flex>
              </Flex>
            </Flex>
            <Flex
              justify="flex-start"
              align="flex-start"
              direction="column"
              wrap="wrap"
            >
              <img src="/consultant.png" alt="" />
              <p style={{ width: "20vw" }}>{Comment}</p>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
};

export default Result;
