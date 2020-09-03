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
        font-family: BigNoodleTooOblique, sans-serif;
        font-size: 3em;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        min-height: 100%;
        background-color: #111;

        .loading-screen-text {
            position: static;
            height: 1em;
            display: inline-block;
        }
    }
</style>
