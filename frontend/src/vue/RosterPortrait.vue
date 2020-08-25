<template>
    <HeroPortraitSkewed
            class="roster-portrait"
            :hero="hero"
            :banned="banned"
            :selected-out="selectedOut"
            v-bind:style="{ 'border-color': borderColor }"
            @contextmenu.native="(e) => {e.preventDefault(); e.stopPropagation();return false;}"
            @portraitTap="onPortraitTap"
            v-bind:data-hero-data-name="hero.dataName"
            :selected="selected"
            v-bind:class="{ 'selected': selected }"
    >
        <template v-slot:top>
            <slot name="top"/>
        </template>
        <template v-slot:bottom>
            <slot name="bottom"/>
        </template>
    </HeroPortraitSkewed>
</template>

<script>
    import HeroPortraitSkewed from "./HeroPortraitSkewed.vue";

    export default {
        props: {
            hero: Object,
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
            selected: {
                type: Boolean,
                default: false,
            }
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
            touch(e) {
            }
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
        border: .08vw solid transparent;
    }
</style>
