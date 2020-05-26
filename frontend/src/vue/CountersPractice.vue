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
    import Picks from '../vue/Picks.vue';
    import Pick from '../js/Pick.js';
    import Backend from '../js/Backend.js';
    import Roster from '../vue/Roster.vue';
    import PickContextGenerator from "../js/PickContextGenerator";
    import axios from "axios";
    import env from '../../build/env.js'
    import Keypress from 'vue-keypress'

    let shuffleCounter = 0;
    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(axios, backendUrl);
    const generator = new PickContextGenerator();
    export default {
        methods: {
            nextPick() {
                this.pickMade = false;
                const context =
                    generator.generateForRandomRole(shuffleCounter++);
                this.bans.replaceAll(context.bans);
                this.$refs.allyPicks.heroes.replaceAll(
                    context.allyHeroes.heroes
                );
                this.$refs.enemyPicks.heroes.replaceAll(
                    context.enemyHeroes
                );
                this.$refs.roster.updateSelection(context);
            },
            /**
             * @param {Hero} hero
             */
            onHeroSelect: function (hero) {
                if (this.pickMade === true) {
                    return;
                }
                this.pickMade = true;
                const $allyPicks = this.$refs.allyPicks;
                const $enemyPicks = this.$refs.enemyPicks;
                const $roster = this.$refs.roster;
                backend.evaluatePick(
                    new Pick(
                        hero,
                        $allyPicks.heroes.filter(it => it !== null),
                        $enemyPicks.heroes,
                        this.bans,
                        "Hanamura"
                    )
                ).then(evaluation => {
                    $roster.displayEvaluation(hero, evaluation);
                });
            },
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
