import heroes from "./heroes";
import TeamComp from "./TeamComp";

/**
 * @param {TeamComp} allyComp
 * @param {?TeamComp} enemyComp
 * @param {Hero[]} bans
 * @param {?string} map
 * @constructor
 */
function PickContext(
    allyComp,
    enemyComp,
    bans,
    map
) {
    this.allyComp = allyComp;
    this.enemyComp = enemyComp;
    this.bans = bans;
    this.map = map;
}

/**
 * @returns {Hero[]}
 */
PickContext.prototype.heroesLeftForRoster = function () {
    const remainingRoles = this.allyComp.remainingRoles();
    return heroes.filter(
        hero =>
            !this.allyComp.heroes.find(
                allyHero => allyHero !== null && allyHero.equals(hero)
            )
            && remainingRoles.includes(hero.role)
    );
};

/**
 * @returns {boolean}
 */
PickContext.prototype.isAllPick = function () {
    return this.enemyComp !== null;
};

/**
 * Lists heroes that can't be picked in this context because their roles are
 * full or they themselves are already selected.
 * @returns {Hero[]}
 */
PickContext.prototype.selectedOutHeroes = function () {
    if (this.enemyComp !== null && !this.enemyComp.isFull()) {
        return [
            ...this.enemyComp.picks(),
            ...this.enemyComp.heroesInPickedOutRoles()
        ];
    } else if (!this.allyComp.isFull()) {
        return [
            ...this.allyComp.picks(),
            ...this.allyComp.heroesInPickedOutRoles()
        ];
    } else {
        return [...heroes];
    }
};

PickContext.prototype.forRequest = function () {
    return {
        allyComp: this.allyComp.heroes.filter(h => h !== null).map(hero => hero.dataName),
        enemyComp:
            (
                this.isAllPick()
                    ? [...this.enemyComp.heroes]
                    : TeamComp.empty().heroes
            )
                .filter(h => h !== null).map(hero => hero.dataName),
        bans: this.bans.map(hero => hero.dataName),
        map: this.map
    }
};

export default PickContext;