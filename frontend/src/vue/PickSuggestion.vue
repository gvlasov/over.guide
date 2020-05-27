<template>
    <div class="root">
        <div style="position: relative">
            <Picks
                    ref="enemyPicks"
                    style="margin-bottom: 1.5vw;"
                    v-bind:style="{ visibility: isAllPick ? 'visible' : 'hidden' }"
                    :teamComp="enemyComp"
                    @pickTap="unselectEnemyHero"
            />
            <Picks
                    ref="allyPicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="allyComp"
                    @pickTap="unselectAllyHero"
            />
            <input
                    type="button"
                    class="mode-change-button"
                    value="all picks"
                    v-hammer:tap="goToAllPick"
                    v-if="!isAllPick"
            />
            <input
                    type="button"
                    class="mode-change-button"
                    value="pre match picks"
                    v-hammer:tap="goToPreMatchPick"
                    v-if="isAllPick"
            />
        </div>
        <Roster
                ref="picksRoster"
                :bans="bans"
                :selected-out-heroes="selectedOutHeroes"
                :selected-hero="null"
                :heroes="allHeroes"
                v-on:heroSelect="onHeroSelect"
                v-if="suggestion === null"
        />
        <Roster
                ref="suggestionsRoster"
                :bans="bans"
                :selected-out-heroes="selectedOutHeroes"
                :heroes="suggestion.heroesSorted(h => -h.score)"
                :suggestion="suggestion"
                v-if="suggestion !== null"
        />
    </div>
</template>

<script>
    import Picks from '../vue/Picks.vue';
    import Backend from '../js/Backend.js';
    import Roster from '../vue/Roster.vue';
    import axios from "axios";
    import env from '../../build/env.js'
    import heroes from "../js/heroes.js";
    import TeamComp from "../js/TeamComp.js";
    import PickContext from "../js/PickContext.js";

    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(axios, backendUrl);
    export default {
        props: {
            bans: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            goToAllPick() {
                this.isAllPick = true;
                this.allyComp = TeamComp.empty();
                this.enemyComp = TeamComp.empty();
                this.suggestion = null;
            },
            goToPreMatchPick() {
                this.isAllPick = false;
                this.allyComp = TeamComp.empty();
                this.enemyComp = TeamComp.empty();
                this.suggestion = null;
            },
            unselectAllyHero(hero, position) {
                if (hero === null) {
                    return;
                }
                this.allyComp.unsetAtPosition(position);
                this.suggestion = null;
            },
            unselectEnemyHero(hero, position) {
                if (hero === null) {
                    return;
                }
                this.enemyComp.unsetAtPosition(position);
                this.suggestion = null;
            },
            /**
             * @param {Hero} hero
             */
            onHeroSelect(hero) {
                if (this.isAllPick && !this.enemyComp.isFull()) {
                    if (this.enemyComp.canSelect(hero)) {
                        this.enemyComp.setNextAvailable(hero);
                    } else {
                        throw new Error("Can't select " + hero.name + " is enemy comp");
                    }
                } else if (this.allyComp.canSelect(hero)) {
                    this.allyComp.setNextAvailable(hero);
                } else {
                    throw new Error("Can't select " + hero.name + " is either comp");
                }
                if (
                    (!this.isAllPick || this.enemyComp.isFull())
                    && this.allyComp.numberOfVacancies() === 1
                ) {
                    const self = this;
                    backend
                        .suggestPick(
                            new PickContext(
                                this.allyComp,
                                this.enemyComp,
                                [],
                                "Hanamura"
                            )
                        )
                        .then(suggestion => {
                            self.suggestion = suggestion;
                        })
                        .catch(reason => alert(reason));
                }
            },
        },
        computed: {
            selectedOutHeroes() {
                if (this.isAllPick && !this.enemyComp.isFull()) {
                    return [
                        ...this.enemyComp.picks(),
                        ...this.enemyComp.heroesInPickedOutRoles()
                    ];
                } else if (!this.allyComp.isFull()) {
                    return [
                        ...this.allyComp.picks(),
                        ...this.allyComp.heroesInPickedOutRoles()
                    ];
                } else {
                    return this.allHeroes;
                }
            },
        },
        data() {
            return {
                isAllPick: true,
                allyComp: TeamComp.empty(),
                enemyComp: TeamComp.empty(),
                suggestion: null,
                allHeroes: [...heroes],
            }
        },
        components: {
            Picks: Picks,
            Roster: Roster,
        },
    };

</script>

<style scoped>
    .mode-change-button {
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
</style>
