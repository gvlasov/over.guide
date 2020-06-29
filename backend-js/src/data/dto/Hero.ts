import Role from "../Role"

export default interface Hero {
    readonly name: string;
    readonly dataName: string;
    readonly role: Role;
}
