import * as shuffle from "fast-shuffle"

export default class SeededShuffler {

    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    shuffle<T>(array: T[]): T[] {
        return shuffle.default(this.seed)(
            array
        );
    }

}
