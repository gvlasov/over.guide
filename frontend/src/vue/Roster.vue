<template>
    <div class="root">
        <RosterPortrait
                v-for="hero in heroes"
                ref="portraits"
                :hero="hero"
                :isGoodPick="isGoodPick(hero)"
                style="width: 5vw; height: 8vw; margin: 0.4vw;"
                :banned="isHeroBanned(hero)"
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
            goodPicks: {
                type: Array,
                default: () => []
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
            isGoodPick(hero) {
                return this.goodPicks
                    .map(hero => hero.dataName)
                    .indexOf(hero.dataName) > -1;
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
             * @param {Hero} hero
             * @returns {RosterPortrait|undefined}
             */
            getHeroPortrait(hero) {
                return this.$refs.portraits
                    .find(portrait => portrait.hero.dataName === hero.dataName);
            },
            /**
             * @param {Hero} hero
             */
            pickHero(hero) {
                const heroPortrait = this.getHeroPortrait(hero);
                if (typeof heroPortrait === 'undefined') {
                    throw new Error(hero.name + " is not in roster");
                }
                heroPortrait.selected = true;
            },
            /**
             * @param {PickContext} context
             */
            updateSelection(context) {
                this.goodPicks.clear();
                this.bans.replaceAll(context.bans);
                this.heroes.replaceAll(context.heroesLeftForRoster());
                this.$refs.portraits.forEach(portrait => portrait.selected = false);
            }
        },
        data() {
            const self = this;
            return {
                heroes: [...heroes],
                showName: true,
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
