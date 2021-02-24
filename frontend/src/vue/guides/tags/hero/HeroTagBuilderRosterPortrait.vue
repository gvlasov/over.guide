<template>
    <div class="proportional-height-wrap">
        <RosterPortrait
                class="roster-portrait"
                :hero="hero"
                :banned="false"
                :selected-out="false"
                :selected="selected"
                @heroSelect="bubbleHeroSelect"
                v-bind:data-hero-data-name="hero.dataName"
                v-bind:class="gamerPosition.dataName"
        />
    </div>
</template>

<script lang="ts">
import RosterPortrait from "@/vue/RosterPortrait";
import GamerPositionVso from "@/ts/vso/GamerPositionVso";
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import HeroDto from "data/dto/HeroDto";
import AbilityVso from "@/ts/vso/AbilityVso";
import Component from "vue-class-component";

@Component({
    components: {
        RosterPortrait,
    },
})
export default class HeroTagBuilderRosterPortrait extends Vue {
    @Prop({required: true})
    hero: HeroDto

    @Prop({default: false})
    selected: boolean

    @Prop({required: true})
    abilities: AbilityVso[]

    @Prop({required: true})
    tagGroupAbilities: AbilityVso[]

    @Prop({required: true})
    gamerPosition: GamerPositionVso

    @Watch('selected')
    onSelectedChange(value) {
        if (value === false) {
            this.tagGroupAbilities.splice(
                0,
                this.tagGroupAbilities.length,
                ...([...this.tagGroupAbilities].filter(
                    ability => ability.hero.id !== this.hero.id
                ))
            );
        }
    }

    bubbleHeroSelect() {
        this.$emit('heroSelect', this.hero)
    }
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/tags.scss';

.proportional-height-wrap {
    /* https://stackoverflow.com/a/14896313/1542343 */
    position: relative;
    width: 9.4%;
    padding-bottom: 10.6%;
    display: inline-block;
    margin: .34%;
    transform: skew(-25deg) translateZ(0);


    opacity: 1;
    filter: grayscale(0%);
    transition: .12s;
    cursor: pointer;
    &[disabled=disabled] {
        opacity: .4;
        transform: skew(-25.1deg) translateZ(0);
        filter: grayscale(70%);
        transition: .12s;
        cursor: default;
    }
}

.roster-portrait {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: .2em;
    margin: 0;
    transform: translateX(-50%) skew(0deg);
}

.selected {
    z-index: 9000;
    border: .08vw solid white;

    &.player {
        background-color: $tag-player-color;
    }

    &.teammate {
        background-color: $tag-teammate-color;
    }

    &.enemy {
        background-color: $tag-enemy-color;
    }
}

</style>
