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
    @import "~@/assets/css/fonts.scss";
    @import "~@/assets/css/overwatch-ui.scss";

    .overwatch-button {
        @include overwatch-inline-button;
        background-color: transparent;
        z-index: 1;
    }

    .overwatch-button > .content {
        position: relative;
        overflow: hidden;
        padding: .05em 1.07em .19em 1.07em;
    }

    button {
        outline: 0;
        font-size: 2rem;
        &[disabled] {
            pointer-events: none;
            & ::v-deep .background {
                background-color: transparent;
            }
        }
    }

    .overwatch-main-button > .background {
        @include overwatch-button-bg-main;
    }

    .overwatch-default-button > .background {
        @include overwatch-button-bg-default;
    }
</style>
