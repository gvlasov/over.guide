<template>
    <div class="weak-panel root-content-panel-wrap">
        <div class="root-content-panel">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/common.scss';

.weak-panel {
    padding: 1em;
    @include overwatch-panel;
    background-color: rgba(adjust-hue($overwatch-panel-bg-color, 210), 0.43);
    margin-bottom: 2em;
    margin-top: 2em;
    @include overwatch-futura-no-smallcaps;
    color: white;
    text-shadow: 0 0 .13em black;

    a {
        color: inherit;
    }

    line-height: 2.3em;
    font-size: 1.3em;

}
</style>
