export default class SeededShuffler {
    private seed;
    constructor(seed: number);
    shuffle<T>(array: T[]): T[];
}
