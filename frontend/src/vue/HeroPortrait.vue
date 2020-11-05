<template>
    <img
            class="hero-portrait"
            :src="imgSrc(hero)"
            v-bind:data-hero-data-name="hero ? hero.dataName : ''"
    />
</template>

<script lang="ts">
import HeroDto from "data/dto/HeroDto";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class HeroPortrait extends Vue {
    @Prop({required: true})
    hero: HeroDto

    @Prop({default: '/images/hero-portraits'})
    baseUrl: string

    imgSrc(hero: HeroDto | null): string {
        if (hero === null) {
            return '/images/undefined-hero.png'
        } else {
            return this.baseUrl + '/' + hero.dataName + ".png"
        }
    }
};

</script>

<style scoped>
img {
    width: 100%;
}
</style>
