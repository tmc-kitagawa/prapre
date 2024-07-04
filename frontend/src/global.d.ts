import exp = require("node:constants");

export interface SlideResult {
    countPercentage: number,
    elapsedTime: number,
    countFastSpeed: number
}

export interface History {
    id: number,
    title: string,
     startTime: number,
     userId: number,
     scoreEye: number,
     scoreVolume: number,
     scoreFiller: number,
     scoreSpeed: number,
     scoreTime: number
}