<template>
    <ExcerptTimebar
            :start-seconds="0"
            :end-seconds="0"
            :current-seconds="currentSeconds"
            :duration-seconds="durationSeconds"
            :enable-slider-label="false"
            :enable-drag-behavior="false"
            @draglessClick="(e) => setCurrentSecondsFromEvent(e)"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import ExcerptTimebar from "@/vue/videos/ExcerptTimebar.vue";
import {Model, Prop} from "vue-property-decorator";

@Component({
    components: {
        ExcerptTimebar,
    }
})
export default class GuideVideoExcerptTimebar extends Vue {

    @Model('input')
    currentSeconds: number

    @Prop({required: true})
    durationSeconds: number

    setCurrentSecondsFromEvent(dragPosition) {
        this.$emit('input', dragPosition * this.durationSeconds)
    }
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
