<template>
    <div class="ability-select">
        <AbilityCheckbox
                v-for="ability in abilities"
                :model-value="selectedAbilities"
                @change="($event)=>$emit('selectedAbilitiesChange', $event)"
                :value="ability"
                :key="ability.id"
        />
    </div>
</template>

<script lang="ts">
import abilities from 'data/abilities';
import AbilityCheckbox from "@/vue/guides/tags/hero/AbilityCheckbox";
import AbilityVso from "@/ts/vso/AbilityVso";
import Vue from 'vue'
import Component from "vue-class-component";
import {Model, Prop} from "vue-property-decorator";
import HeroDto from "data/dto/HeroDto";

@Component({
    components: {
        AbilityCheckbox,
    },
})
export default class AbilitySelect extends Vue {
    @Model('selectedAbilitiesChange', {required: true})
    selectedAbilities: AbilityVso[]

    @Prop({required: true})
    heroes: HeroDto[]

    get abilities(): AbilityVso[] {
        const allAbilities = Array.from(abilities.values());
        return this.heroes.flatMap(
            hero => allAbilities.filter(ability => ability.heroId === hero.id)
        )
            .map(it => new AbilityVso(it))
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/fonts.scss";

/*.grid {*/
/*    display: grid;*/
/*    grid-template-columns: repeat(4, max-content);*/
/*}*/
.ability-select {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .ability-checkbox {
        margin: .2rem;
    }

}

</style>
