import HeroDto from "data/dto/HeroDto";
import AbilityVso from "@/js/vso/AbilityVso";

export default class TagGroupVso {
    constructor(
        public readonly heroes: HeroDto[],
        public readonly abilities: AbilityVso[]
    ) {
    }
}

