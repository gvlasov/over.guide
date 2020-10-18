<template>
    <ExcerptTimebar
            :start-seconds="0"
            :end-seconds="0"
            :current-seconds="currentSeconds"
            :duration-seconds="durationSeconds"
            :enable-slider-label="false"
            :enable-drag-behavior="false"
            @draglessClick="(e) => $emit('draglessClick', e)"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ExcerptTimebar from "../videos/ExcerptTimebar.vue";
import {Prop} from "vue-property-decorator";

@Component({
    components: {
        ExcerptTimebar,
    }
})
export default class GuideVideoExcerptTimebar extends Vue {

    @Prop({required: true})
    currentSeconds: number

    @Prop({required: true})
    durationSeconds: number

};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";

.excerpt-timebar ::v-deep .slider {
    background-color: #ba0000;
    width: 2px;
    box-shadow: 0 0 2px red;
}
</style>
