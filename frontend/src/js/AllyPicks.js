var _ = require('lodash');

/**
 * @param {(Hero|null)[]} heroes
 * @constructor
 */
function AllyPicks(heroes) {
    if (heroes.length !== 6 || !heroes.includes(null)) {
        throw new Error(
            "There must be exactly 6 positions in ally picks, one of which is null"
        )
    }
    if (
        _.uniq(
            heroes.map(hero => hero === null ? null : hero.name)
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
