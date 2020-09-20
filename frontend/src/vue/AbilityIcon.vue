<template>
    <img
            :src="imgSrc"
            v-bind:data-ability-data-name="ability.dataName"
            :title="ability.name"
    />
</template>

<script lang="ts">
import AbilityVso from "@/ts/vso/AbilityVso";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class AbilityIcon extends Vue {
    @Prop({required: true})
    ability: AbilityVso

    get imgSrc() {
        return '/images/abilities/' + this.ability.hero.dataName + '/' + this.ability.dataName + '.png';
    }
};

</script>

<style scoped>
img {
    width: 100%;
}
</style>
