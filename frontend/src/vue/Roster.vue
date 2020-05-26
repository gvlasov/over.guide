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
                v-hammer:tap="onPortraitTapHacky(hero)"
        />
    </div>
</template>

<script>
    import heroes from "../js/heroes.js";
    import RosterPortrait from "./RosterPortrait.vue";

    export default {
        props: {
            onHeroSelect: {
                type: Function,
            },
            bans: {
                type: Array,
            },
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
             * @see https://www.npmjs.com/package/vue2-touch-events#how-to-add-extra-parameters The hack
             */
            onPortraitTapHacky(hero) {
                const self = this;
                return function (event) {
                    if (!self.isHeroBanned(hero)) {
                        self.$emit('heroSelect', hero)
                    }
                }
            },
            /**
             * @param {PickContext} context
             */
            updateSelection(context) {
                this.bans.replaceAll(context.bans);
                this.heroes.replaceAll(context.heroesLeftForRoster());
                this.selectedHero = null;
                this.scores = null;
            },
            /**
             * @param {Hero} playerPick
             * @param {PickEvaluation} evaluation
             */
            displayEvaluation(playerPick, evaluation) {
                this.heroes.replaceAll(
                    evaluation.heroesSorted(a => -a.score)
                );
                this.selectedHero = playerPick;
                this.scores = evaluation.toMap();
            },
            /**
             * @param {Hero} hero
             * @return {number|undefined}
             */
            pickScore(hero) {
                if (this.scores === null) {
                    return undefined;
                } else {
                    return this.scores.get(hero);
                }
            },
        },
        data() {
            const self = this;
            return {
                heroes: [...heroes],
                scores: null,
                showName: true,
                selectedHero: null,
                onclick: function () {

                }
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
</style>
