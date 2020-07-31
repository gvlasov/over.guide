import AbilityId from "data/AbilityId";

export default interface AbilityDto {
    readonly id: AbilityId;
    readonly group?: string;
    readonly name: string;
    readonly dataName: string
    readonly description: string;
}
