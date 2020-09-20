<template>
    <div class="background-heading">
        <slot/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({})
export default class BackgroundHeading extends Vue {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.background-heading {
    font-family: BigNoodleTooOblique, sans-serif;
    font-size: 8em;
    text-shadow: 0 0 .1em #333;
    color: white;
    opacity: .5;
    user-select: none;
    white-space: nowrap;
    text-align: left;
}

</style>
