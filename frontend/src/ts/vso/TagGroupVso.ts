import HeroDto from "data/dto/HeroDto";
import AbilityVso from "@/ts/vso/AbilityVso";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";

export default class TagGroupVso {
    constructor(
        public heroes: HeroDto[],
        public abilities: AbilityVso[],
        public readonly gamerPosition: GamerPositionVso
    ) {
    }

    selectedAbilities(hero: HeroDto): AbilityVso[] {
        return this.abilities.filter(a => a.hero.id === hero.id)
    }
}

