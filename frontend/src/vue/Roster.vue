<template>
    <div class="root">
        <RosterPortrait
                v-for="hero in heroes"
                ref="portraits"
                :hero="hero"
                style="width: 5vw; height: 8vw; margin: 0.4vw;"
                :banned="isHeroBanned(hero)"
                :selected="isHeroSelected(hero)"
                :pick-score="pickScore(hero)"
                :selected-out="isHeroSelectedOut(hero)"
                v-hammer:tap="onPortraitTapHacky(hero)"
        />
    </div>
</template>

<script>
    import heroes from "../js/heroes.js";
    import RosterPortrait from "./RosterPortrait.vue";
    import PickSuggestion from "../js/PickSuggestion.js";
    import Hero from "../js/Hero.js";

    export default {
        props: {
            heroes: {
                type: Array,
                default: () => [...heroes],
            },
            bans: {
                type: Array,
                default: () => []
            },
            selectedOutHeroes: {
                type: Array,
                default: () => []
            },
            suggestion: {
                type: PickSuggestion,
                default: () => null
            },
            selectedHero: {
                type: Hero,
                default: null
            }
        },
        methods: {
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroBanned(hero) {
                return this.bans.filter(h => hero.name === h.name).length > 0;
            },
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroSelected(hero) {
                return this.selectedHero !== null && this.selectedHero.equals(hero);
            },
            /**
             * @param {Hero} hero
             */
            isHeroSelectedOut(hero) {
                return typeof this.selectedOutHeroes.find(h => h.equals(hero)) !== 'undefined';
            },
            /**
             * @param {Hero} hero
             * @see https://www.npmjs.com/package/vue2-touch-events#how-to-add-extra-parameters The hack
             */
            onPortraitTapHacky(hero) {
                const self = this;
                return function (event) {
                    if (!self.isHeroBanned(hero) && !self.isHeroSelectedOut(hero)) {
                        self.$emit('heroSelect', hero)
                    }
                }
            },
            /**
             * @param {Hero} hero
             * @return {number|undefined}
             */
            pickScore(hero) {
                if (this.suggestion === null) {
                    return undefined;
                } else {
                    return this.suggestion.score(hero);
                }
            },
        },
        data() {
            return {
                showName: true,
            }
        },
        components: {
            RosterPortrait: RosterPortrait,
        },
    };

</script>

<style scoped>
    .root {
        display: inline-block;
        list-style: none;
        margin-block-start: 0;
        margin-block-end: 0;
        padding-inline-start: 0;
    }

    .selected-out {

    }
</style>
