import HeroDto from "data/dto/HeroDto";

import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class Roster_SelectedOutHeroesMixin extends Vue {
    declare selectedOutHeroes: HeroDto[]

    isHeroSelectedOut(hero: HeroDto) {
        return this.selectedOutHeroes.find(h => h.dataName === hero.dataName) !== void 0;
    }
};
