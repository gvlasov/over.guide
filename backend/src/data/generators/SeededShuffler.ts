const shuffle = require("fast-shuffle").default;

export default class SeededShuffler {

    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    shuffle<T>(array: T[]): T[] {
        return shuffle(this.seed)(
            array
        );
    }

}
