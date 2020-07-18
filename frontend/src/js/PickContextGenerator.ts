import TeamCompGenerator from "./TeamCompGenerator";
import PickContext from "./PickContext";
import BansGenerator from "./BansGenerator";
import RoleGenerator from "./RoleGenerator";
import TeamComp from "./TeamComp";
import Role from "data/Role";
import SeededShuffler from "@/js/SeededShuffler";

export default class PickContextGenerator {

    constructor(private readonly shuffler: SeededShuffler) {
    }

    generateForRole(yourRole: Role): PickContext {
        const bans = new BansGenerator(
            this.shuffler
        ).generate();
        const teamCompGenerator = new TeamCompGenerator(bans, this.shuffler);
        return new PickContext(
            teamCompGenerator.generateForRole(yourRole),
            teamCompGenerator.generateComplete(),
            bans,
            "Hanamura"
        );
    };

    generateForRandomRole(availableRoles: Role[]): PickContext {
        return this.generateForRole(
            new RoleGenerator(availableRoles, this.shuffler).generate()
        );
    };

    generateEmptyAlliesOnly(): PickContext {
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            null,
            new BansGenerator(this.shuffler).generate(),
            "Hanamura"
        );
    };

    generateEmptyAllPick(): PickContext {
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            new TeamComp([null, null, null, null, null, null]),
            new BansGenerator(this.shuffler).generate(),
            "Hanamura"
        );
    };
}
