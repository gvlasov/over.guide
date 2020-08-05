<template>
    <button
            class="overwatch-button"
            v-bind:class="'overwatch-'+type+'-button'"
    >
        <div class="background"></div>
        <div class="content">
            <slot></slot>
        </div>
    </button>
</template>

<script>

    export default {
        name: 'OverwatchButton',
        props: {
            type: {
                type: String,
                required: true,
            }
        },
        methods: {},
        data() {
            return {}
        },
    };

</script>

<style lang="scss" scoped>
    @import "~@/assets/css/fonts.css";
    @import "~@/assets/css/overwatch-ui.scss";

    .overwatch-button {
        @include overwatch-inline-button;
        background-color: transparent;
    }

    .overwatch-button > .content {
        position: relative;
        overflow: hidden;
        padding: .03em 1.07em .19em 1.07em;
    }



    .overwatch-main-button > .background {
        @include overwatch-button-bg-main;
    }

    .overwatch-default-button > .background {
        @include overwatch-button-bg-default;
    }
</style>
