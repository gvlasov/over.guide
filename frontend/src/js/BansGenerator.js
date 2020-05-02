import heroes from "../js/heroes.js";
import seedrandom from "seedrandom";
import shuffle from "fast-shuffle";

/**
 * @constructor
 */
function BansGenerator() {

}

/**
 * @param {number|string} seed
 * @returns {Hero[]}
 */
BansGenerator.prototype.generate = function (seed) {
    const random = seedrandom(seed + 1000000);
    const supports =
        shuffle(
            heroes.filter(hero => hero.isSupport()),
            () => random()
        )
            .slice(0, 1);
    const tanks =
        shuffle(
            heroes.filter(hero => hero.isTank()),
            () => random()
        )
            .slice(0, 1);
    const damage =
        shuffle(
            heroes.filter(hero => hero.isDamage()),
            () => random()
        )
            .slice(0, 2);
    return tanks.concat(damage).concat(supports);
};

export default BansGenerator;
