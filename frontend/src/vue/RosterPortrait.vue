<template>
    <HeroPortraitSkewed
            :hero="hero"
            v-bind:class="{ enabled : enabled, disabled: !enabled, banned : banned, 'is-good-pick': isGoodPick }"
    />
</template>

<script>
    import HeroPortraitSkewed from "./HeroPortraitSkewed.vue";
    import Hero from "../js/Hero";

    export default {
        props: {
            hero: Hero,
            enabled: {
                type: Boolean,
                default: true
            },
            banned: {
                type: Boolean,
                default: false
            },
            isGoodPick: {
                type: Boolean,
                default: false
            }
        },
        methods: {},
        data() {
            return {}
        },
        components: {
            HeroPortraitSkewed: HeroPortraitSkewed,
        },
    };

</script>

<style scoped>
    .root {
        display: inline-block;
    }

    .enabled {
    }

    .disabled {
        display: none !important;
    }

    .banned {
        opacity: .3;
        filter: hue-rotate(-60deg);
        cursor: not-allowed !important;
    }

    .is-good-pick {
        box-shadow: green 0 0 .4vw 1vw;
        z-index: 4;
    }
</style>
