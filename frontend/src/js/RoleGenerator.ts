import Role from "data/Role"
import SeededShuffler from "@/js/SeededShuffler";

export default class RoleGenerator {


    constructor(
        private readonly availableRoles: Role[],
        private readonly shuffler: SeededShuffler,
    ) {

    }

    generate(): Role {
        return this.shuffler.shuffle(
            this.availableRoles
        )[0];
    };
}
