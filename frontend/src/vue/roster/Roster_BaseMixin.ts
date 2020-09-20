import heroes from "data/heroes";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import HeroDto from "data/dto/HeroDto";

@Component({})
export default class Roster_BaseMixin extends Vue {
    @Prop({default: () => Array.from(heroes.values())})
    heroes!: HeroDto[]
};
