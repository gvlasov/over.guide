import HeroDto from "data/dto/HeroDto";
import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class Roster_SelectedHeroesMixin extends Vue {

    declare selectedHeroes: HeroDto[]

    clearSelection() {
        this.selectedHeroes.splice(0, this.selectedHeroes.length)
    }


    isHeroSelected(hero: HeroDto): boolean {
        return this.selectedHeroes.find(h => h.dataName === hero.dataName) !== undefined;
    }


    onHeroTap(hero: HeroDto) {
        const index = this.selectedHeroes.findIndex(h => h.dataName === hero.dataName);
        if (index === -1) {
            this.selectedHeroes.push(hero)
        } else {
            this.selectedHeroes.splice(index, 1)
        }
        this.$emit('selectedHeroesChange', this.selectedHeroes);
    }

};
