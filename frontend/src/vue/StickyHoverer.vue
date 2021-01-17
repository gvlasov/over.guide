<template>
    <div class="sticky-hoverer">
        <slot></slot>
    </div>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class StickyHoverer extends Vue {

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";
.sticky-hoverer {
    display: inline-block;
    overflow: visible;
    position: sticky;

    &.hovering {
        box-shadow: 0 0 1.7rem $overwatch-panel-bg-color, 0 0 .4rem $overwatch-panel-bg-color !important;
    }
}
</style>
