<template>
    <div
            class="skew"
            v-bind:class="{ banned : banned, 'selected-out' : selectedOut }"
    >
        <HeroPortrait
                :hero="hero"
                class="skew-underlying"
                style="min-width: 100%;"
        />
    </div>
</template>

<script>
    import Hero from '../js/Hero.js';
    import HeroPortrait from "./HeroPortrait.vue";

    export default {
        name: 'HeroPortraitSkewed',
        props: {
            'hero': Hero,
            banned: {
                type: Boolean,
                default: false
            },
            selectedOut: {
                type: Boolean,
                default: false
            }
        },
        methods: {},
        data() {
            return {}
        },
        components: {
            HeroPortrait: HeroPortrait,
        },
    };

</script>

<style scoped>
    .skew {
        position: relative;
        display: inline-block;
        -ms-transform: skew(-25deg, 0deg);
        -webkit-transform: skew(-25deg, 0deg);
        transform: skew(-25deg, 0deg);
        overflow: hidden;
        border-radius: .4vw;
        margin-right: .4vw;
        border: .14vw solid white;
        cursor: pointer;
    }

    .skew-underlying {
        -ms-transform: skew(25deg, 0deg) scale(2.0);
        -webkit-transform: skew(25deg, 0deg) scale(2.0);
        transform: skew(25deg, 0deg) scale(2.0);
    }

    .banned > .skew-underlying {
        opacity: .3;
        filter: hue-rotate(-60deg);
    }

    .banned {
        cursor: not-allowed !important;
    }

    .selected-out > .skew-underlying {
        opacity: .3;
    }
</style>
