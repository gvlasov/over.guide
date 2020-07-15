import seedrandom, {prng} from "seedrandom";
import shuffle from "fast-shuffle";

export default class SeededShuffler {

    private readonly random: prng;

    constructor(seed: string) {
        this.random = seedrandom(seed);
    }

    shuffle<T>(array: T[]): T[] {
        return shuffle(
            array,
            () => this.random()
        );
    }

}
