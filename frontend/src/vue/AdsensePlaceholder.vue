<template>
    <div
            class="adsense-placeholder"
            v-bind:style="{ width: width + 'px', height: height + 'px', 'line-height' : height + 'px' }"
    >
        <slot/>
    </div>
</template>

<script>

    export default {
        props: {
            width: {
                type: Number,
                default: 468,
            },
            height: {
                type: Number,
                default: 60,
            }
        }
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
