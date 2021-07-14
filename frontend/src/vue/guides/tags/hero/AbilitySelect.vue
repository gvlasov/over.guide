<template>
    <div class="ability-select">
        <AbilityCheckbox
                v-for="ability in abilities"
                :model-value="selectedAbilities"
                @change="($event)=>hasMaxAbilities && !isSelected(ability) || $emit('selectedAbilitiesChange', $event)"
                :value="ability"
                :key="ability.id"
                :disabled="hasMaxAbilities && !isSelected(ability)"
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
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import {MAX_DESCRIPTOR_TOTAL_ABILITY_COUNT} from "data/dto/GuideDescriptorDto";

@Component({
    components: {
        AbilityCheckbox,
    },
})
export default class AbilitySelect extends Vue {
    @Prop({required: true})
    descriptor: GuideDescriptorVso

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

    private isSelected(ability: AbilityVso): boolean  {
        return this.selectedAbilities.find(it => it.id === ability.id) !== void 0
    }

    get hasMaxAbilities(): boolean {
        return this.descriptor.abilitiesLength >= MAX_DESCRIPTOR_TOTAL_ABILITY_COUNT
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
        user-select: none;
        margin: .2rem;
        opacity: 1;
        filter: grayscale(0%);
        transition: .1s;
        cursor: pointer;
        &[disabled=disabled] {
            opacity: .4;
            filter: grayscale(70%);
            transition: .1s;
            cursor: default;
        }
    }

}

</style>
