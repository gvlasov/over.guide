<template>
    <HeroPortraitSkewed
            class="roster-portrait"
            :hero="hero"
            :banned="banned"
            :selected-out="selectedOut"
            v-bind:style="{ 'border-color': borderColor }"
            @contextmenu.native="(e) => {e.preventDefault(); e.stopPropagation();return false;}"
            @portraitTap="onPortraitTap"
            v-bind:data-hero-data-name="hero.dataName"
            :selected="selected"
            v-bind:class="{ 'selected': selected }"
    >
        <template v-slot:top>
            <slot name="top"/>
        </template>
        <template v-slot:bottom>
            <slot name="bottom"/>
        </template>
    </HeroPortraitSkewed>
</template>

<script lang="ts">
import HeroPortraitSkewed from "@/vue/HeroPortraitSkewed.vue";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import HeroDto from "data/dto/HeroDto";
import Component from "vue-class-component";

@Component({
    components: {
        HeroPortraitSkewed: HeroPortraitSkewed,
    },
})
export default class RosterPortrait extends Vue {
    @Prop({required: true})
    hero: HeroDto

    @Prop({default: undefined})
    pickScore: number

    @Prop({default: false})
    banned: boolean

    @Prop({default: false})
    selectedOut: boolean

    @Prop({default: false})
    selected: boolean

    /**
     * @see https://www.npmjs.com/package/vue2-touch-events#how-to-add-extra-parameters The hack
     */
    onPortraitTap() {
        if (!this.banned && !this.selectedOut) {
            this.$emit('heroSelect', this.hero)
        }
    }

    get borderColor(): string {
        if (this.pickScore === undefined) {
            return '';
        } else if (this.pickScore === 0) {
            return '#fdea76'
        } else if (this.pickScore > 0) {
            return '#1eab2f'
        } else {
            return '#f7556d';
        }
    }
}

</script>

<style scoped>
.roster-portrait {
    width: 5vw;
    height: 7vw;
    margin: 0.4vw;
    border: .08vw solid transparent;
}
</style>
