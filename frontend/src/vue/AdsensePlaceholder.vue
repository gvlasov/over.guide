<template>
    <div
            class="adsense-placeholder"
            v-bind:style="{ width: width + 'px', height: height + 'px', 'line-height' : height + 'px' }"
    >
        <slot/>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({})
export default class AdsensePlaceholder extends Vue {
    @Prop({default: 480})
    width: number
    @Prop({default: 60})
    height: number
};

</script>

<style scoped>
.adsense-placeholder {
    border: 1px solid grey;
    box-sizing: border-box;
    display: inline-block;
    line-height: 100%;
    text-align: center;
    max-width: 100%;
}
</style>
