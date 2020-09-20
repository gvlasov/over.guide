import HeroDto from "data/dto/HeroDto";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class Roster_BansMixin extends Vue {
    @Prop({default: () => []})
    bans!: HeroDto[]

    isHeroBanned(hero: HeroDto): boolean {
        return this.bans.find(h => hero.dataName === h.dataName) !== undefined;
    }
};
