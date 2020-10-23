<template>
    <div class="overwatch-panel">
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    components: {},
})
export default class OverwatchPanel extends Vue {
};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.overwatch-panel  {
    box-shadow: 0 .1rem .3rem $overwatch-panel-bg-color;
    background-color: rgba($overwatch-panel-bg-color, 0.43);
}

</style>
