import TeamCompGenerator from "./TeamCompGenerator";
import PickContext from "./PickContext";
import BansGenerator from "./BansGenerator";
import RoleGenerator from "./RoleGenerator";
import TeamComp from "./TeamComp";

/**
 * @constructor
 */
function PickContextGenerator() {
}

/**
 * Generates a pick context.
 * @param {number} seed
 * @param {string} yourRole Which hero role in ally team to leave blank.
 */
PickContextGenerator.prototype.generateForRole = function (
    seed,
    yourRole
) {
    const bans = new BansGenerator().generate(seed);
    const teamCompGenerator = new TeamCompGenerator(bans);
    return new PickContext(
        teamCompGenerator.generateForRole(yourRole, seed),
        teamCompGenerator.generateComplete(seed + 1),
        bans,
        "Hanamura"
    );
};

/**
 * @param {string} availableRoles
 * @param {number} seed
 */
PickContextGenerator.prototype.generateForRandomRole = function (availableRoles, seed) {
    return this.generateForRole(
        seed,
        new RoleGenerator(availableRoles).generate(seed)
    );
};

PickContextGenerator.prototype.generateEmptyAlliesOnly = function (seed) {
    const bans = new BansGenerator().generate(seed);
    return new PickContext(
        new TeamComp([null, null, null, null, null, null]),
        null,
        bans,
        "Hanamura"
    );
};

PickContextGenerator.prototype.generateEmptyAllPick = function (seed) {
    const bans = new BansGenerator().generate(seed);
    return new PickContext(
        new TeamComp([null, null, null, null, null, null]),
        new TeamComp([null, null, null, null, null, null]),
        bans,
        "Hanamura"
    );
};

export default PickContextGenerator;
