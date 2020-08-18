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
        font-size: 2rem;
        white-space: nowrap;
    }

    .overwatch-button > .content {
        position: relative;
        overflow: hidden;
        padding: .15em .2em .25em .2em;
        min-width: 1em;
        min-height: 1em;
        width: auto;
    }

    button[disabled] {
        pointer-events: none;
    }

    .overwatch-main-button > .background {
        @include overwatch-button-bg-main;
    }

    .overwatch-default-button > .background {
        @include overwatch-button-bg-default;
    }
</style>
