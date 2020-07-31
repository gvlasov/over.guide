import HeroDto from "data/dto/HeroDto";
import AbilityDto from "data/dto/AbilityDto";

export default class TagGroupVso {
    constructor(
        public readonly heroes: HeroDto[],
        public readonly abilities: AbilityDto[]
    ) {
    }
}

