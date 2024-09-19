import { ScoreData } from "../global";

export const fbComment = (scoreData: ScoreData): string[] => {
  const ascSortedArr = [
    { name: "scoreEye", score: scoreData.scoreEye },
    { name: "scoreVolume", score: scoreData.scoreVolume },
    { name: "scoreFiller", score: scoreData.scoreFiller },
    { name: "scoreSpeed", score: scoreData.scoreSpeed },
    { name: "scoreTime", score: scoreData.scoreTime },
  ].sort(function (a, b) {
    return a.score - b.score;
  });

  const minData = ascSortedArr[0];
  const maxData = ascSortedArr[4];

  const comment = {
    "scoreEye": [
        "もっとカメラに目線を合わせれば、より視聴者の心を掴めるでしょう。",
        "もっとカメラに目線を合わせれば、より視聴者の心を掴めるでしょう。",
        "もっとカメラに目線を合わせれば、より視聴者の心を掴めるでしょう。",
        "カメラ目線はできています。",
        "カメラ目線はバッチリです。",
    ],
    "scoreVolume": [
        "もっと声を出した方が良いでしょう。",
        "もう少し声を出した方が良いでしょう。",
        "声がもう少し出るとより良いです。",
        "声はよく出ています。",
        "声はよく出ており、自信のあるプレゼンに感じられます。",
      ],
    "scoreFiller": [
        "繋ぎ言葉が多いため、意識して減らすようにすると説得力が増します。",
        "繋ぎ言葉が多いため、意識して減らすようにすると説得力が増します。",
        "繋ぎ言葉を減らせれば、より説得力が増すことでしょう。",
        "繋ぎ言葉があまりなく、説得力が感じられます。",
        "繋ぎ言葉がほぼなく、説得力のあるプレゼンができています。",
    ],
    "scoreSpeed": [
        "話すスピードが早いため、もう少し落ち着きましょう。",
        "話すスピードが早いため、もう少し文章を抑えてもいいでしょう。",
        "話すスピードが若干早いので、もう少し文章を抑えてもいいでしょう。",
        "話す速度は適切です。",
        "話す速度は適切です。",
      ],
    "scoreTime": [
        "時間が大幅にずれているため、調整が必要かもしれません。",
        "時間が大幅にずれているため、調整が必要かもしれません。",
        "時間がずれているため、調整が必要かもしれません。",
        "時間調整はほぼ問題ありません。",
        "時間調整は文句なしです",
    ]
  }

  type ScoreKey = 'scoreEye' | 'scoreVolume' | 'scoreFiller' | 'scoreSpeed' | 'scoreTime';

  const result = []
  if (maxData.score > 60) {
    result.push(comment[maxData.name as ScoreKey][Math.floor((maxData.score - 0.5) / 20)])
  } else {
    result.push("")
  }
  if (minData.score <= 60) {
    result.push(comment[minData.name as ScoreKey][Math.max(0, Math.floor((minData.score - 0.5) / 20))])
  } else {
    result.push("")
  }

  return result;
};
