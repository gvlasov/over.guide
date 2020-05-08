<template>
    <div>
        <Picks
                ref="enemyPicks"
                v-on:click.native="nextPick"
                :bans="bans"
        />
        <Picks
                ref="allyPicks"
                v-on:click.native="nextPick"
                :bans="bans"
        />
        <Roster
                ref="roster"
                :bans="bans"
                v-on:heroSelect="onHeroSelect"
        />
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Pick from '../js/Pick.js';
    import Backend from '../js/Backend.js';
    import Roster from '../vue/Roster.vue';
    import PicksGenerator from "../js/PicksGenerator";
    import BansGenerator from "../js/BansGenerator";
    import heroes from "../js/heroes";
    import axios from "axios";
    import env from '../../dist/env.js'

    const bansGenerator = new BansGenerator();
    let shuffleCounter = 0;
    const backend = new Backend(axios, env.BACKEND_URL);
    export default {
        methods: {
            nextPick() {
                const seed = shuffleCounter++;
                const bans = bansGenerator.generate(seed);
                this.bans = bans;
                const picksGenerator = new PicksGenerator(bans);
                const picks = picksGenerator.generateSeeded(seed);
                this.setAllyPicks(picks);
                this.setEnemyPicks(picksGenerator.generateForRole(null, shuffleCounter));
                const disabledCategories = picks.getCompletelyPickedCategories();
                this.$refs.roster.enabledHeroes.splice(0, this.$refs.roster.enabledHeroes.length);
                let enabledHeroes = heroes.filter(
                    (hero) =>
                        !disabledCategories.includes(hero.role)
                        && !picks.heroes.includes(hero)
                );
                this.$refs.roster.enabledHeroes.push(
                    ...enabledHeroes
                );
            },
            /**
             * @param {Hero} hero
             */
            onHeroSelect: function (hero) {
                backend.evaluatePick(
                    new Pick(
                        hero,
                        this.$refs.allyPicks.heroes.filter(it => it !== null),
                        this.$refs.enemyPicks.heroes,
                        this.bans,
                        "Hanamura"
                    )
                )
            },
            /**
             * @param {AllyPicks} picks
             */
            setAllyPicks(picks) {
                this.$refs.allyPicks.heroes.splice(0, picks.heroes.length);
                this.$refs.allyPicks.heroes.push(...picks.heroes);
            },
            /**
             * @param {AllyPicks} picks
             */
            setEnemyPicks(picks) {
                this.$refs.enemyPicks.heroes.splice(0, picks.heroes.length);
                this.$refs.enemyPicks.heroes.push(...picks.heroes);
            }
        },
        data() {
            const self = this;
            return {
                bans: []
            }
        },
        components: {
            Picks: Picks,
            Roster: Roster,
        },
    };

</script>

<style scoped>

</style>
