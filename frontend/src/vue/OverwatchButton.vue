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

<style scoped>
    .overwatch-button {
        display: inline-block;
        border: 0;
        background-color: transparent;
        padding: 0;
        margin: 0;
        position: relative;
        cursor: pointer;
        user-select: none;
        font-size: 3.0em;
        line-height: 1em;
        letter-spacing: 0.03em;
        overflow: hidden;
    }

    .overwatch-button > .content {
        color: white;
        position: relative;
        font-weight: bold;
        padding: .03em 1.07em .19em 1.07em;
        font-variant-caps: all-small-caps;
    }

    .overwatch-button > .background {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: .06em;
        font-family: 'Futura Demi Bold', sans-serif;
        opacity: .7;
    }

    .overwatch-button:hover:enabled > .background {
        box-shadow: 0 0 1pt 1pt white inset;
        opacity: 1;
    }

    .overwatch-button:disabled > .background {
        background-color: transparent;
        box-shadow: 0 0 1pt 1pt darkgray inset;
        color: lightgrey;
    }

    .overwatch-button:disabled:hover > .background {
        background-color: transparent;
        box-shadow: 0 0 1pt 1pt darkgray inset;
        color: lightgrey;
    }

    .overwatch-main-button > .background {
        background-color: orange;
    }

    .overwatch-default-button > .background {
        background-color: #2991de;
    }
</style>
