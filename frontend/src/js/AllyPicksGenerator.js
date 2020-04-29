var heroes = require('../js/heroes.js');
var _ = require('lodash');
var AllyPicks = require('../js/AllyPicks.js');

/**
 * @constructor
 */
function AllyPicksGenerator() {
}

/**
 * @param {string} yourRole
 * @returns {AllyPicks}
 */
AllyPicksGenerator.prototype.generate = function (yourRole) {
    var supports =
        _.shuffle(heroes.filter(hero => hero.isSupport()))
            .slice(0, yourRole === 'Support' ? 1 : 2);
    var tanks =
        _.shuffle(heroes.filter(hero => hero.isTank()))
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    var damage =
        _.shuffle(heroes.filter(hero => hero.isDamage()))
            .slice(0, yourRole === 'Damage' ? 1 : 2);
    return new AllyPicks(tanks.concat(damage).concat(supports))
};
module.exports = AllyPicksGenerator;
