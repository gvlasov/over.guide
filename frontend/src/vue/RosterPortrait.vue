<template>
    <HeroPortraitSkewed
            class="roster-portrait"
            :hero="hero"
            :banned="banned"
            :selected-out="selectedOut"
            v-bind:style="{ 'border-color': borderColor }"
            v-flex-touch="(e) => e.preventDefault()"
            v-hammer:tap="onPortraitTap"
    />
</template>

<script>
    import HeroPortraitSkewed from "./HeroPortraitSkewed.vue";
    import Hero from "../js/Hero";

    export default {
        props: {
            hero: Hero,
            pickScore: {
                default: undefined,
            },
            banned: {
                type: Boolean,
                default: false
            },
            selectedOut: {
                type: Boolean,
                default: false
            },
        },
        methods: {
            /**
             * @see https://www.npmjs.com/package/vue2-touch-events#how-to-add-extra-parameters The hack
             */
            onPortraitTap() {
                if (!this.banned && !this.selectedOut) {
                    this.$emit('heroSelect', this.hero)
                }
            },
        },
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
    .roster-portrait {
        width: 5vw;
        height: 7vw;
        margin: 0.4vw;
    }
</style>
