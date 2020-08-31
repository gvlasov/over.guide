import {prng} from "seedrandom";
import shuffle from "fast-shuffle";

export default class SeededShuffler {

    private readonly random: prng;
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
