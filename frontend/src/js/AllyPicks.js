var _ = require('lodash');

/**
 * @param {Hero[]} heroes
 * @constructor
 */
function AllyPicks(heroes) {
    if (heroes.length !== 5) {
        throw new Error(
            "There must be exactly 5 heros in ally picks"
        )
    }
    if (
        _.uniq(
            heroes.map(hero => hero.name)
        )
            .length < heroes.length
    ) {
        throw new Error(
            "Heroes in a team composition must be unique"
        );
    }
    this.heroes = heroes;
}

module.exports = AllyPicks;
