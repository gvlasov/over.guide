<template>
    <div
            class="tag-custom-badge"
            v-bind:class="tag.cssClass"
    >
        <span v-html="tag.value"></span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import ThematicTagDto from "data/dto/ThematicTagDto";
import Component from "vue-class-component";

@Component({})
export default class ThematicTagBadge extends Vue{
    @Prop({required: true})
    tag: ThematicTagDto
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
@import "~@/assets/css/tags.scss";

.tag-custom-badge {
    @include overwatch-futura;
    display: inline-block;
    padding: .17em .3em .3em .3em;
    border-radius: .3em;
    vertical-align: middle !important;
    box-shadow: 0 0 .13em #343434;
    white-space: nowrap;
}

.theme {
    @include tag-bg-theme;
}

.map {
    @include tag-bg-map;
}
</style>