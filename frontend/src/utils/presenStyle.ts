import {ScoreData} from "../global";

export const getStyle = ({scoreEye, scoreVolume, scoreFiller, scoreSpeed, scoreTime}: ScoreData, setName: React.Dispatch<React.SetStateAction<string>>): string => {
    let result = ""

    if (scoreSpeed <= 20) {
        result += "早口"
    } else if (scoreSpeed <= 40) {
        result += "お喋り"
    } else if (scoreSpeed <= 60) {
        result += ""
    } else if (scoreSpeed <= 80) {
        result += "デキる"
    } else {
        result += "カリスマ"
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
        setName("student")
    } else if (others <= 40) {
        result += "フレッシュマン"
        setName("freshman")
    } else if (others <= 60) {
        result += "営業"
        setName("sales")
    } else if (others <= 80) {
        result += "コンサル"
        setName("consultant")
    } else {
        result += "起業家"
        setName("entrepreneur")
    }

    return result
}

