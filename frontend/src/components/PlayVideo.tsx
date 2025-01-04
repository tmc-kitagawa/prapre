import {FC, useRef, useState} from "react";
import styles from "./PlayVideo.module.scss"
import {FileWithPath} from "@mantine/dropzone";
import {Document, Page} from "react-pdf";

interface Props {
    url: string;
    slide: FileWithPath;
    countPages: number;
    times: number[];
    totalElapsed: number;
    fillers: number[][];
}

export const PlayVideo: FC<Props> = ({url, slide, countPages, times, totalElapsed, fillers}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const cumulativeTimes: number[] = []
    for (let i = 0; i < times.length; i++) {
        if (i === 0) cumulativeTimes.push(times[i])
        else cumulativeTimes.push(times[i] + cumulativeTimes[i - 1])
    }
    const displayTimes = cumulativeTimes.map(time => {
        const min = Math.floor(time / 60).toString().padStart(2, "0")
        const sec = (time % 60).toString().padStart(2, "0")
        return `${min}:${sec}`
    })

    // 指定秒数に飛ぶ関数例
    const handleJumpTo = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
            videoRef.current.play()
        }
    };

    const handleTimeUpdate = (time: number) => {
        if (videoRef.current) {
            for (let i = 0; i < countPages; i++) {
                if (time <= cumulativeTimes[i]) {
                    setCurrentPage(i + 1)
                    return
                }
            }
            setCurrentPage(countPages)
        }
    };


    return (
        <>
            <div>
                <p>録画</p>
                <div className={styles.videoContainer}>
                    <div className={styles.videoWrapper}>
                        <video
                            ref={videoRef}
                            src={url}
                            controls={true}
                            className={styles.video}
                            onTimeUpdate={(event) => {
                                handleTimeUpdate(event.currentTarget.currentTime)
                            }}
                        />
                        <Document file={slide} className={styles.videoPage}>
                            <Page height={100} pageNumber={currentPage}/>
                        </Document>
                    </div>
                </div>
            </div>
            <div>
                <p>タイムライン</p>
                <div className={styles.timelineContainer}>
                    <div className={styles.captionContainer}>
                        <div className={styles.captionPage}>
                            <p>ページ</p>
                        </div>
                        <div className={styles.captionFiller}>
                            <p>繋ぎ言葉</p>
                        </div>
                    </div>
                    <div className={styles.pagesContainer}>
                        {Array.from({length: countPages}, (_, i) => (
                            <div key={i} className={styles.detailContainer}>
                                <div className={styles.pageContainer}>
                                    <Document file={slide}>
                                        <Page height={100} pageNumber={i + 1} className={styles.page}
                                              onClick={() => handleJumpTo(i === 0 ? 0 : cumulativeTimes[i - 1])}/>
                                    </Document>
                                </div>
                                <div style={{width: `${90 * times[i] / totalElapsed}vw`}}
                                     className={styles.timeBox}>
                                    {fillers[i].map((filler) => (
                                        <div style={{left: `${(90 * times[i] / totalElapsed) * (filler / times[i])}vw`}}
                                             onClick={() => handleJumpTo(i === 0 ? filler : filler + cumulativeTimes[i - 1])}
                                             className={styles.filler}></div>
                                    ))}
                                    <div className={styles.upperTriangle}></div>
                                    <div className={styles.lowerTriangle}></div>
                                </div>
                                <div className={styles.timeContainer}>
                                    <p>{displayTimes[i]}</p>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>

            </div>
        </>
    );
}

export default PlayVideo;
