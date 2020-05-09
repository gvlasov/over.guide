<template>
    <div class="root">
        <Keypress
                key-event="keydown"
                :key-code="32"
                @success="nextPick"
                :preventDefault="true"
        />
        <Picks
                ref="enemyPicks"
                :bans="bans"
                style="margin-bottom: 1.5vw;"
        />
        <Picks
                ref="allyPicks"
                :bans="bans"
                style="margin-bottom: 1.5vw;"
        />
        <Roster
                ref="roster"
                :bans="bans"
                v-on:heroSelect="onHeroSelect"
                class="roster"
        />
    </div>
</template>

<script>
    import Vue from 'vue'
    import Picks from '../vue/Picks.vue';
    import Pick from '../js/Pick.js';
    import Backend from '../js/Backend.js';
    import Roster from '../vue/Roster.vue';
    import PicksGenerator from "../js/PicksGenerator";
    import BansGenerator from "../js/BansGenerator";
    import heroes from "../js/heroes";
    import axios from "axios";
    import env from '../../dist/env.js'
    import _ from 'lodash'
    import Keypress from 'vue-keypress'

    const bansGenerator = new BansGenerator();
    let shuffleCounter = 0;
    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(
        axios,
        backendUrl
    );
    export default {
        methods: {
            nextPick() {
                this.pickMade = false;
                this.$refs.roster.goodPicks.splice(0, this.$refs.roster.enabledHeroes.length);
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
                if (this.pickMade === true) {
                    return;
                }
                this.pickMade = true;
                const self = this;
                const evaluation = backend.evaluatePick(
                    new Pick(
                        hero,
                        this.$refs.allyPicks.heroes.filter(it => it !== null),
                        this.$refs.enemyPicks.heroes,
                        this.bans,
                        "Hanamura"
                    )
                ).then(evaluation => {
                    const currentPicks = self.$refs.allyPicks.heroes;
                    const myPickIndex = [...currentPicks].indexOf(null);
                    let alternativeHeroesDataNames = Object.keys(evaluation.alternatives);
                    let hero1 = heroes.filter(
                        hero => hero.dataName ===
                            _.maxBy(
                                alternativeHeroesDataNames,
                                key => evaluation.alternatives[key]
                            )
                    )[0];
                    Vue.set(self.$refs.allyPicks.heroes, myPickIndex, hero1);
                    let goodPicks = self.$refs.roster.goodPicks;
                    goodPicks.splice(0, goodPicks.length);
                    goodPicks.push(...heroes.filter(h => alternativeHeroesDataNames.indexOf(h.dataName) > -1))
                    //     setTimeout(function () {
                    //         self.nextPick()
                    //     }, 500)
                });
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
        mounted: function () {
            this.nextPick();
        },
        data() {
            const self = this;
            return {
                bans: [],
                pickMade: false
            }
        },
        components: {
            Picks: Picks,
            Roster: Roster,
            Keypress: Keypress
        },
    };

</script>

<style scoped>
    .root {
        /*width: 50em;*/
        text-align: center;
        vertical-align: middle;
        display: inline-block;
    }

    .next-pick-button {
        width: 5em;
        height: 5em;
        vertical-align: top;
        margin-left: 3em;
    }

    .roster {
        text-align: center;
    }
</style>
