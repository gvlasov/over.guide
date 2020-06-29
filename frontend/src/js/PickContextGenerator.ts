import TeamCompGenerator from "./TeamCompGenerator";
import PickContext from "./PickContext";
import BansGenerator from "./BansGenerator";
import RoleGenerator from "./RoleGenerator";
import TeamComp from "./TeamComp";
import Role from "data/Role";

export default class PickContextGenerator {

    generateForRole(
        seed: string,
        yourRole: Role
    ): PickContext {
        const bans = new BansGenerator().generate(seed);
        const teamCompGenerator = new TeamCompGenerator(bans);
        return new PickContext(
            teamCompGenerator.generateForRole(yourRole, seed),
            teamCompGenerator.generateComplete(seed + 1),
            bans,
            "Hanamura"
        );
    };

    generateForRandomRole(availableRoles: Role[], seed: string) {
        return this.generateForRole(
            seed,
            new RoleGenerator(availableRoles).generate(seed)
        );
    };

    generateEmptyAlliesOnly(seed: string) {
        const bans = new BansGenerator().generate(seed);
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            null,
            bans,
            "Hanamura"
        );
    };

    generateEmptyAllPick = function (seed: string) {
        const bans = new BansGenerator().generate(seed);
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            new TeamComp([null, null, null, null, null, null]),
            bans,
            "Hanamura"
        );
    };
}
