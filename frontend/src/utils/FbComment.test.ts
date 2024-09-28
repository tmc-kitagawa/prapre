import { ScoreData } from "../global";
import { fbComment } from "./FbComment";

describe("feedback comment", () => {
  let mockScoreData: ScoreData;
  beforeEach(() => {
    mockScoreData = {
      title: "sample",
      startTime: 20,
      userId: null,
      scoreEye: 30,
      scoreVolume: 20,
      scoreFiller: 50,
      scoreSpeed: 50,
      scoreTime: 50,
    };
  });

  it("should return an array of result which length is at least 1", () => {
    const result = fbComment(mockScoreData)
    assert.isAtLeast(result.length, 1)
  })

  it("should return an array of result which length is 2 shen max score > 60 & min score <= 60", () => {
    mockScoreData = {
        title: "sample",
        startTime: 20,
        userId: null,
        scoreEye: 50,
        scoreVolume: 60,
        scoreFiller: 70,
        scoreSpeed: 90,
        scoreTime: 100,
    }
    const result = fbComment(mockScoreData)
    expect(result.length).toBe(2)
  })
});
