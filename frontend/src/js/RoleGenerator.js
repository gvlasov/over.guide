import seedrandom from "seedrandom";

/**
 * @constructor
 */
function RoleGenerator(availableRoles) {
    this.availableRoles = availableRoles;
}

/**
 * @param {number} seed
 * @return {string}
 */
RoleGenerator.prototype.generate = function (seed) {
    const random = Math.ceil(seedrandom(seed)() * this.availableRoles.length);
    return this.availableRoles[random - 1];
};

export default RoleGenerator;
