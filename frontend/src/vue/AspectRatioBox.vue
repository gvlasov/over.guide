<template>
    <div
            class="aspect-ratio-box"
            v-bind:style="{'padding-top': paddingPercentage+'%'}"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

/**
 * @see https://css-tricks.com/aspect-ratio-boxes/
 */
@Component({})
export default class AspectRatioBox extends Vue {
    @Prop({default: () => 16 / 9})
    aspectRatio: number

    get paddingPercentage(): number {
        return 100 / this.aspectRatio;
    }
};

</script>

<style lang="scss" scoped>
.aspect-ratio-box {
    height: 0;
    overflow: hidden;
    position: relative;

    & ::v-deep * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
