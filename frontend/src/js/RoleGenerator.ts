import seedrandom from "seedrandom";
import Role from "data/Role"

export default class RoleGenerator {

    private readonly availableRoles: Role[];

    constructor(availableRoles: Role[]) {
        this.availableRoles = availableRoles;

    }

    generate(seed: string): Role {
        const random = Math.ceil(seedrandom(seed)() * this.availableRoles.length);
        return this.availableRoles[random - 1];
    };
}
