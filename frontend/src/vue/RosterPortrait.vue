<template>
    <HeroPortraitSkewed
            :hero="hero"
            v-bind:class="{ enabled : enabled, disabled: !enabled, banned : banned, selected: selected }"
            v-bind:style="{ 'border-color': borderColor }"
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
            pickScore: {
                default: undefined,
            },
            banned: {
                type: Boolean,
                default: false
            },
            selected: {
                type: Boolean,
                default: () => false,
            },
        },
        methods: {},
        computed: {
            /**
             * @return {string}
             */
            borderColor() {
                if (this.pickScore === undefined) {
                    return '';
                } else if (this.pickScore === 0) {
                    return '#fdea76'
                } else if (this.pickScore > 0) {
                    return '#1eab2f'
                } else {
                    return '#f7556d';
                }
            }
        },
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

    .selected {
        transform: skew(-25deg, 0deg) scale(1.4) !important;
        z-index: 9000;
        box-shadow: black 1vw 1vw 1vw;
    }
</style>
