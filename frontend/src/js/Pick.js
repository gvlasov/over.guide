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
export default Pick;