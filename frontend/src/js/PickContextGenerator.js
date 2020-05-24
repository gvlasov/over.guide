import TeamCompGenerator from "./TeamCompGenerator";
import PickContext from "./PickContext";
import BansGenerator from "./BansGenerator";
import RoleGenerator from "./RoleGenerator";

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
        teamCompGenerator.generateComplete(seed + 1).heroes,
        bans,
        "Hanamura"
    );
};

/**
 * @param {number} seed
 */
PickContextGenerator.prototype.generateForRandomRole = function (seed) {
    return this.generateForRole(
        seed,
        new RoleGenerator().generate(seed)
    );
};

export default PickContextGenerator;
