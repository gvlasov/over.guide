import Role from "../Role"

export default interface HeroDto {
    readonly id: number;
    readonly name: string;
    readonly dataName: string;
    readonly role: Role;
}
