var heroes = require('../js/heroes.js');
var _ = require('lodash');
var seedrandom = require('seedrandom');
var AllyPicks = require('../js/AllyPicks.js');

/**
 * @constructor
 */
function AllyPicksGenerator() {

/**
 * @param {string|undefined} yourRole
 * @returns {AllyPicks}
 */
AllyPicksGenerator.prototype.generateForRole = function (yourRole) {
    var supports =
        _.shuffle(heroes.filter(hero => hero.isSupport()))
            .slice(0, yourRole === 'Support' ? 1 : 2);
    if (yourRole === 'Support') {
        supports.push(null);
    }
    var tanks =
        _.shuffle(heroes.filter(hero => hero.isTank()))
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    if (yourRole === 'Tank') {
        tanks.push(null);
    }
    var damage =
        _.shuffle(heroes.filter(hero => hero.isDamage()))
            .slice(0, yourRole === 'Damage' ? 1 : 2);
    if (yourRole === 'Damage') {
        damage.push(null);
    }
    return new AllyPicks(tanks.concat(damage).concat(supports))
};
    /**
     * @param {string} seed
     */
    AllyPicksGenerator.prototype.generateSeeded = function (seed) {
        var random = Math.ceil(seedrandom(seed)() * 3);
        if (random === 1) {
            return this.generateForRole('Tank');
        } else if (random === 2) {
            return this.generateForRole('Support');
        } else {
            return this.generateForRole('Damage');
        }
    }

}
module.exports = AllyPicksGenerator;
