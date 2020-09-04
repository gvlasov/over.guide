import TeamCompGenerator from "./TeamCompGenerator";
import PickContext from "./PickContext";
import BansGenerator from "./BansGenerator";
import RoleGenerator from "./RoleGenerator";
import TeamComp from "./TeamComp";
import Role from "data/Role";
import SeededShuffler from "data/generators/SeededShuffler";
import MapId from "data/MapId";

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
            MapId.Hanamura
        );
    };

    generateForRandomRole(availableRoles: Role[]): PickContext {
        return this.generateForRole(
            new RoleGenerator(availableRoles, this.shuffler).generate()
        );
    };

    generateEmptyTeammatesOnly(): PickContext {
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            null,
            new BansGenerator(this.shuffler).generate(),
            MapId.Hanamura
        );
    };

    generateEmptyAllPick(): PickContext {
        return new PickContext(
            new TeamComp([null, null, null, null, null, null]),
            new TeamComp([null, null, null, null, null, null]),
            new BansGenerator(this.shuffler).generate(),
            MapId.Hanamura
        );
    };
}
