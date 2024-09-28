import { ScoreData } from "../global"
import { getStyle } from "./presenStyle"

describe("presen style", () => {
    let mockScoreData: ScoreData
    let spySetName: React.Dispatch<React.SetStateAction<string>>
    beforeEach(() => {
        mockScoreData = {
            "scoreEye": 30,
            "scoreVolume": 50,
            "scoreFiller": 90,
            "scoreSpeed": 59,
            "scoreTime": 60,
        } as ScoreData
        spySetName = vi.fn()
    })

    it("should return 営業 (scoreEye + scoreFiller + scoreTime) / 3 = 60", () => {
        const result = getStyle(mockScoreData, spySetName)
        expect(result).toBe("営業")
    })

    it("should call setName with an argument", () => {
        getStyle(mockScoreData, spySetName)
        expect(spySetName).toHaveBeenCalledWith("sales")
    })
})