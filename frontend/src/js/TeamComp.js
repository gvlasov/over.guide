import uniq from "lodash/uniq";
import Vue from 'vue';
import heroes from "./heroes";

/**
 * @param {?Hero[]} heroes
 * @constructor
 */
function TeamComp(heroes) {
    if (heroes.length !== 6) {
        throw new Error(
            "There must be exactly 6 positions, but there are " + heroes.length
        )
    }
    const picks =
        heroes
            .filter(hero => hero !== null)
            .map(hero => hero.name);
    if (uniq(picks).length < picks.length) {
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

/**
 * @returns {string}
 */
TeamComp.prototype.remainingRole = function () {
    const remainingRoles = this.remainingRoles();
    if (remainingRoles.length !== 1) {
        throw new Error("More than 1 role remaining: " + remainingRoles.join(', '));
    }
    return remainingRoles[0];
};

/**
 * @returns {string[]}
 */
TeamComp.prototype.remainingRoles = function () {
    const pickedRoles = this.getCompletelyPickedCategories();
    return ['Support', 'Damage', 'Tank'].diff(pickedRoles);
};

/**
 * @param {Hero} hero
 */
TeamComp.prototype.setNextAvailable = function (hero) {
    const position = this.getNextVacancyForRole(hero.role);
    if (position === null) {
        throw new Error('No position at role ' + hero.role);
    }
    this.setAtPosition(position, hero);
};

/**
 * @param {number} position
 * @param {Hero} hero
 */
TeamComp.prototype.setAtPosition = function (position, hero) {
    if (position < 0 || position > 5) {
        throw new Error("Position must be in 0..5");
    }
    if (hero !== null) {
        if (hero.role === 'Tank' && position !== 0 && position !== 1) {
            throw new Error('Tanks can only be set at positions 0 and 1');
        } else if (hero.role === 'Damage' && position !== 2 && position !== 3) {
            throw new Error('Tanks can only be set at positions 2 and 3');
        } else if (hero.role === 'Support' && position !== 4 && position !== 5) {
            throw new Error('Tanks can only be set at positions 4 and 5');
        }
    }
    Vue.set(this.heroes, position, hero);
};

/**
 * @returns {number}
 */
TeamComp.prototype.numberOfVacancies = function () {
    return this.heroes.filter(h => h === null).length;
};

/**
 * @param {number} position
 */
TeamComp.prototype.unsetAtPosition = function (position) {
    this.setAtPosition(position, null);
};


/**
 * @param {string} role
 * @return {?number} The position that is open for that role, or
 * null if there is no open position for that role.
 */
TeamComp.prototype.getNextVacancyForRole = function (role) {
    if (role === 'Tank') {
        if (this.heroes[0] === null) {
            return 0;
        } else if (this.heroes[1] === null) {
            return 1;
        }
    } else if (role === 'Damage') {
        if (this.heroes[2] === null) {
            return 2;
        } else if (this.heroes[3] === null) {
            return 3;
        }
    } else if (role === 'Support') {
        if (this.heroes[4] === null) {
            return 4;
        } else if (this.heroes[5] === null) {
            return 5;
        }
    }
    return null;
};

/**
 * @param {string} role
 * @returns {boolean}
 */
TeamComp.prototype.hasVacancyForRole = function (role) {
    return this.getNextVacancyForRole(role) !== null;
};

/**
 * @param {Hero} hero
 */
TeamComp.prototype.canSelect = function (hero) {
    return this.hasVacancyForRole(hero.role) && typeof this.heroes.find(h => h !== null && h.equals(hero)) === 'undefined';
};

/**
 * @returns {boolean}
 */
TeamComp.prototype.isFull = function () {
    for (let hero of this.heroes) {
        if (hero === null) {
            return false;
        }
    }
    return true;
};

/**
 * @returns {Hero[]}
 */
TeamComp.prototype.heroesInPickedOutRoles = function () {
    const result = [];
    for (let role of this.getCompletelyPickedCategories()) {
        for (let hero of heroes) {
            if (hero.role === role) {
                result.push(hero);
            }
        }
    }
    return result;
};

/**
 * @returns {Hero[]}
 */
TeamComp.prototype.picks = function () {
    return this.heroes.filter(h => h !== null);
};

/**
 * @returns {TeamComp}
 */
TeamComp.empty = function () {
    return new TeamComp([null, null, null, null, null, null]);
};


export default TeamComp;
