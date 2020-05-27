import _ from "lodash";

/**
 * @param {(Hero|null)[]} heroes
 * @constructor
 */
function TeamComp(heroes) {
    if (heroes.length !== 6) {
        throw new Error(
            "There must be exactly 6 positions"
        )
    }
    const picks =
        heroes
            .filter(hero => hero !== null)
            .map(hero => hero.name);
    if (_.uniq(picks).length < picks.length) {
        throw new Error(
            "Heroes in a team composition must be unique"
        );
    }
    this.heroes = heroes;
}

TeamComp.prototype.getCompletelyPickedCategories = function () {
    let tanks = 0,
        supports = 0,
        damage = 0;
    let roles = this.heroes.filter(it => it !== null).map((hero) => hero.role);
    for (let role of roles) {
        if (role === 'Tank') {
            tanks++;
        } else if (role === 'Support') {
            supports++;
        } else if (role === 'Damage') {
            damage++;
        } else {
            throw new Error('Unknown role ' + role)
        }
    }
    let answer = [];
    if (supports === 2) {
        answer.push('Support');
    }
    if (damage === 2) {
        answer.push('Damage');
    }
    if (tanks === 2) {
        answer.push('Tank');
    }
    return answer;
};

TeamComp.prototype.remainingRole = function () {
    const pickedRoles = this.getCompletelyPickedCategories();
    const remainingRoles = ['Support', 'Damage', 'Tank'].diff(pickedRoles);
    if (remainingRoles.length !== 1) {
        throw new Error("More than 1 role remaining: " + remainingRoles.join(', '));
    }
    return remainingRoles[0];
};

/**
 * @returns {TeamComp}
 */
TeamComp.empty = function () {
    return new TeamComp([null, null, null, null, null, null]);
};


export default TeamComp;
