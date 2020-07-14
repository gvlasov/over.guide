<template>
    <div class="root">
        <RosterPortrait
                v-for="hero in heroes"
                v-bind:key="hero.dataName"
                ref="portraits"
                :hero="hero"
                :banned="isHeroBanned(hero)"
                :pick-score="pickScore(hero)"
                :selected-out="isHeroSelectedOut(hero)"
                v-bind:class="{ selected: isHeroSelected(hero) }"
                @heroSelect="onHeroTap"
        />
    </div>
</template>

<script>
    import heroes from "data/heroes";
    import RosterPortrait from "./RosterPortrait.vue";
    import Hero from "data/dto/Hero";

    export default {
        props: {
            selectionOnTapEnabled: {
                type: Boolean,
                default: true
            },
            heroes: {
                type: Array,
                default: () => Array.from(heroes.values()),
            },
            bans: {
                type: Array,
                default: () => [],
            },
            selectedHeroes: {
                type: Array,
                default: () => [],
            },
            selectedOutHeroes: {
                type: Array,
                default: () => []
            },
            pickScore: {
                type: Function,
                default: (hero) => undefined
            },
        },
        methods: {
            clearSelection() {
                this.selectedHeroes.splice(0, this.selectedHeroes.length)
            },
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroBanned(hero) {
                return typeof this.bans.find(h => hero.dataName === h.dataName) !== 'undefined';
            },
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroSelected(hero) {
                return this.selectedHeroes.find(h => h.dataName === hero.dataName) !== undefined;
            },
            /**
             * @param {Hero} hero
             */
            isHeroSelectedOut(hero) {
                return typeof this.selectedOutHeroes.find(h => h.dataName === hero.dataName) !== 'undefined';
            },
            /**
             * @param {Hero} hero
             */
            onHeroTap(hero) {
                if (!this.selectionOnTapEnabled) {
                    return;
                }
                const index = this.selectedHeroes.findIndex(h => h.dataName === hero.dataName);
                if (index === -1) {
                    this.selectedHeroes.push(hero)
                } else {
                    this.selectedHeroes.splice(index, 1)
                }
                this.$emit('selectedHeroesChange', this.selectedHeroes);
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
        text-align: center;
    }

    .selected {
        transform: skew(-25deg, 0deg) scale(1.4) !important;
        z-index: 9000;
        box-shadow: black 1vw 1vw 1vw;
    }
</style>
