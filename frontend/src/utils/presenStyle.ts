import {ScoreData} from "../global";

export const getStyle = ({scoreEye, scoreVolume, scoreFiller, scoreSpeed, scoreTime}: ScoreData): string => {
    let result = ""

    if (scoreSpeed <= 20) {
        result += ""
    } else if (scoreSpeed <= 40) {
        result += ""
    } else if (scoreSpeed <= 60) {
        result += ""
    } else if (scoreSpeed <= 80) {
        result += ""
    } else {
        result += ""
    }

    if (scoreVolume <= 20) {
        result += "弱腰"
    } else if (scoreVolume <= 40) {
        result += "穏やか"
    } else if (scoreVolume <= 60) {
        result += ""
    } else if (scoreVolume <= 80) {
        result += "ドヤ顔"
    } else {
        result += "マッチョ"
    }

    const others = (scoreEye + scoreFiller + scoreTime) / 3

    if (others <= 20) {
        result += "大学生"
    } else if (others <= 40) {
        result += "フレッシュマン"
    } else if (others <= 60) {
        result += "営業"
    } else if (others <= 80) {
        result += "コンサル"
    } else {
        result += "起業家"
    }

    return result
}

