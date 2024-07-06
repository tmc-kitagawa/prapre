import {ScoreData} from "../global";

interface Comment {
    scoreEye: string;
    scoreVolume: string;
    scoreFiller: string;
    scoreSpeed: string;
    scoreTime: string;
}

export const fbComment = (scoreData: ScoreData): string => {
    const ascSortedArr = [
        {name: "scoreEye", score: scoreData.scoreEye},
        {name: "scoreVolume", score: scoreData.scoreVolume},
        {name: "scoreFiller", score: scoreData.scoreFiller},
        {name: "scoreSpeed", score: scoreData.scoreSpeed},
        {name: "scoreTime", score: scoreData.scoreTime}
    ].sort(function (a, b) {
        return (a.score - b.score);})

    const minData = ascSortedArr[0]
    const maxData = ascSortedArr[4]

    const goodFb: Comment = {
        scoreEye: "カメラをよく見てプレゼンできていますね。",
        scoreVolume: "ハキハキとプレゼンができていますね。",
        scoreFiller: "流暢にプレゼンができていますね。",
        scoreSpeed: "聞き取りやすいプレゼンができていますね。",
        scoreTime: "時間を守れていますね。",
    }

    const badFb: Comment = {
        scoreEye: "あまりカメラが見れていません。次回は目線を意識してみましょう！",
        scoreVolume: "声の大きさが適切ではありません。次回はハキハキと発表しましょう！",
        scoreFiller: "繋ぎ言葉が多いです。次回は繋ぎ言葉を使わないように意識しましょう！",
        scoreSpeed: "話す速度が早すぎます。次回はもう少しゆっくりと話しましょう！",
        scoreTime: "発表時間が適切ではありません。次回は時間に気をつけて発表をしましょう！",
    }

    if(maxData.score < 80){
        return `${badFb[minData.name as keyof Comment]}`
    } else if (minData.score >= 80){
        return `${goodFb[maxData.name as keyof Comment]}\n良いプレゼンができていますね`
    } else {
        return `${goodFb[maxData.name as keyof Comment]}\nただし、${badFb[minData.name as keyof Comment]}`
    }
}

