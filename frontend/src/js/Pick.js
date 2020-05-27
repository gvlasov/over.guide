/**
 * @param {Hero} hero
 * @param {TeamComp} allyComp
 * @param {TeamComp} enemyComp
 * @param {Hero[]} bans
 * @param {string} map
 * @constructor
 */
function Pick(
    hero,
    allyComp,
    enemyComp,
    bans,
    map
) {
    this.hero = hero;
    this.allyComp = allyComp;
    this.enemyComp = enemyComp;
    this.bans = bans;
    this.map = map;
}

Pick.prototype.forRequest = function () {
    return {
        myPick: this.hero.dataName,
        allyComp: this.allyComp.heroes.filter(h => h !== null).map(hero => hero.dataName),
        enemyComp: this.enemyComp.heroes.filter(h => h !== null).map(hero => hero.dataName),
        bans: this.bans.map(hero => hero.dataName),
        map: this.map
    }
};
export default Pick;