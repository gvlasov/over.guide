"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shuffle = require("fast-shuffle").default;
class SeededShuffler {
    constructor(seed) {
        this.seed = seed;
    }
    shuffle(array) {
        return shuffle(this.seed)(array);
    }
}
exports.default = SeededShuffler;
//# sourceMappingURL=SeededShuffler.js.map