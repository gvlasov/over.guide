<template>
    <div class="root">
        <Keypress
                key-event="keydown"
                :key-code="32"
                @success="nextPick"
                :preventDefault="true"
        />
        <div style="position: relative">
            <Picks
                    ref="enemyPicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="enemyComp"
            />
            <Picks
                    ref="allyPicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="allyComp"
            />
            <input
                    type="button"
                    class="next-pick-button"
                    value="⏭️"
                    v-hammer:tap="nextPick"
                    :disabled="!pickMade"
            />
        </div>
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
    import Backend from '../js/Backend.js';
    import Roster from '../vue/Roster.vue';
    import PickContextGenerator from "../js/PickContextGenerator";
    import axios from "axios";
    import env from '../../build/env.js'
    import Keypress from 'vue-keypress'
    import TeamComp from "../js/TeamComp";
    import PickContext from "../js/PickContext";

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
                this.allyComp = context.allyComp;
                this.enemyComp = context.enemyComp;
                this.$refs.roster.updateSelection(context);
            },
            /**
             * @param {Hero} hero
             */
            onHeroSelect: function (hero) {
                if (this.pickMade === true) {
                    return;
                }
                const $allyPicks = this.$refs.allyPicks;
                const $enemyPicks = this.$refs.enemyPicks;
                const $roster = this.$refs.roster;
                backend.suggestPick(
                    new PickContext(
                        $allyPicks.teamComp,
                        $enemyPicks.teamComp,
                        this.bans,
                        "Hanamura"
                    )
                )
                    .then(suggestion => {
                        this.pickMade = true;
                        $roster.displaySuggestion(hero, suggestion);
                    })
                    .catch(reason => alert(reason))
                ;
            },
        },
        mounted: function () {
            this.nextPick();
        },
        data() {
            const self = this;
            return {
                bans: [],
                pickMade: false,
                allyComp: TeamComp.empty(),
                enemyComp: TeamComp.empty()
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
        display: block;
    }

    .next-pick-button {
        width: 25vw;
        height: 18vw;
        border-radius: 9vw 0 0 9vw;
        font-size: 6vw;
        line-height: 6vw;
        background-color: #28253a;
        color: white;
        border: none;
        outline: none;
        cursor: pointer;

        position: absolute;
        top: 20%;
        right: 0;
    }

    .next-pick-button[disabled] {
        pointer-events: none;
        opacity: .2;
    }


    .roster {
        text-align: center;
    }
</style>
