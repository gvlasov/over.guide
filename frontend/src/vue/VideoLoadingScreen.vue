<template>
    <div class="loading-screen">
        <div class="loading-screen-text">Loading video...</div>
    </div>
</template>

<script>
    export default {
        props: {},
        computed: {},
    };

</script>

<style lang="scss" scoped>
    .loading-screen {
        position: absolute;
        height: 8em;
        font-family: BigNoodleTooOblique, sans-serif;
        font-size: 3em;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        text-shadow: 0 0 .06em black;
        min-height: 100%;
        background-color: #111;

        .loading-screen-text {
            position: static;
            flex-basis: 1em;
            height: 1em;
            display: inline-block;
        }
    }
</style>
