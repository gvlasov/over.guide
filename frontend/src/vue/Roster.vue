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
                @heroSelect="onHeroSelect"
        />
    </div>
</template>

<script>
    import heroes from "data/heroes";
    import RosterPortrait from "./RosterPortrait.vue";
    import Hero from "data/dto/Hero";

    export default {
        props: {
            heroes: {
                type: Array,
                default: () => [...heroes],
            },
            bans: {
                type: Array,
                default: () => [],
            },
            selectedHero: {
                type: Hero,
                default: () => null,
            },
            selectedOutHeroes: {
                type: Array,
                default: () => []
            },
            pickScore: {
                type: Function,
                default: (hero) => undefined
            }
        },
        methods: {
            /**
             * @param {Hero} hero
             * @return {boolean}
             */
            isHeroBanned(hero) {
                return typeof this.bans.find(h => hero.equals(h)) !== 'undefined';
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
            onHeroSelect(hero) {
                this.$emit('heroSelect', hero);
            }
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

    .selected {
        transform: skew(-25deg, 0deg) scale(1.4) !important;
        z-index: 9000;
        box-shadow: black 1vw 1vw 1vw;
    }
</style>
