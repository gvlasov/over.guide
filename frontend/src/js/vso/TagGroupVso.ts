import HeroDto from "data/dto/HeroDto";
import AbilityVso from "@/js/vso/AbilityVso";
import GamerPositionVso from "@/js/vso/GamerPositionVso";

export default class TagGroupVso {
    constructor(
        public readonly heroes: HeroDto[],
        public readonly abilities: AbilityVso[],
        public readonly gamerPosition: GamerPositionVso
    ) {
    }

    selectedAbilities(hero: HeroDto): AbilityVso[] {
        console.log(this.abilities)
        return this.abilities.filter(a => a.hero.id === hero.id)
    }
}

