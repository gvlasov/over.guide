<template>
    <div
            class="skew"
            v-bind:class="{ banned : banned, 'selected-out' : selectedOut, 'selected' : selected }"
    >
        <div class="midlay rotated-back">
            <slot name="top"/>
        </div>
        <HeroPortrait
                :hero="hero"
                class="skew-underlying rotated-back"
                style="min-width: 100%;"
                v-hammer:tap="onPortraitTap"
                :base-url="'/images/roster-portraits'"
        />
        <div class="midlay midlay-bottom rotated-back">
            <slot name="bottom"/>
        </div>
    </div>
</template>

<script lang="ts">
import HeroPortrait from "@/vue/HeroPortrait";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import HeroDto from "../../../backend/src/data/dto/HeroDto";

@Component({
    components: {
        HeroPortrait: HeroPortrait,
    },
})
export default class HeroPortraitSkewed extends Vue {
    @Prop({required: true})
    hero: HeroDto
    @Prop({default: false})
    banned: boolean
    @Prop({default: false})
    selectedOut: boolean
    @Prop({default: false})
    selected: boolean

    onPortraitTap() {
        this.$emit('portraitTap', this.hero)
    }
};

</script>

<style lang="scss" scoped>
.skew {
    position: relative;
    display: inline-block;
    -ms-transform: skew(-25deg, 0deg);
    -webkit-transform: skew(-25deg, 0deg);
    transform: skew(-25deg, 0deg);
    overflow: hidden;
    border-radius: .4vw;
    margin-right: .4vw;
    border: .14vw solid white;

    &.banned > .skew-underlying {
        opacity: .3;
        filter: hue-rotate(-60deg);
    }

    &.banned {
        cursor: not-allowed !important;
    }

    &.selected-out > .skew-underlying {
        opacity: .3;
    }

    .skew-underlying {
        height: 100%;
        width: auto;
        margin-right: -100%;
        margin-left: -100%;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    .rotated-back {
        -ms-transform: skew(25deg, 0deg) scale(2.0);
        -webkit-transform: skew(25deg, 0deg) scale(2.0);
        transform: skew(25deg, 0deg) scale(1.0);
    }

    .midlay {
        position: absolute;
        height: 100%;
        max-width: 0;
        z-index: 2;
    }

    .midlay-bottom {
        bottom: 0;
        height: 100% !important;
        left: -3rem;
    }
}
</style>
