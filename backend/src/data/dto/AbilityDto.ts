import AbilityId from "data/AbilityId";
import KeyId from "data/KeyId";
import HeroId from "data/HeroId";

export default interface AbilityDto {
    readonly id: AbilityId;
    readonly heroId: HeroId;
    readonly group?: string;
    readonly name: string;
    readonly keyIds: KeyId[];
    readonly dataName: string
    readonly description: string;
}
