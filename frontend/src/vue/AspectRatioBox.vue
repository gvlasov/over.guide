<template>
    <div
            class="aspect-ratio-box"
            v-bind:style="{'padding-top': paddingPercentage+'%'}"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            aspectRatio: {
                type: Number,
                default: () => 16 / 9
            },
        },
        computed: {
            paddingPercentage() {
                return 100 / this.aspectRatio;
            },
        },
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
