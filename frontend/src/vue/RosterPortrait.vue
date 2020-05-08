<template>
    <HeroPortraitSkewed
            :hero="hero"
            style="width: 3em;"
            v-bind:class="{ enabled : enabled, disabled: !enabled, banned : banned }"
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
    }
</style>
