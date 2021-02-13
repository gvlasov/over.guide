import Role from "../Role"
import HeroId from "data/HeroId";

export default interface HeroDto {
    readonly id: HeroId;
    readonly name: string;
    readonly dataName: string;
    readonly role: Role;
}
