<template>
    <div class="root">
        <div style="position: relative">
            <Picks
                    ref="enemyPicks"
                    style="margin-bottom: 1.5vw;"
                    v-bind:style="{ visibility: isAllPick ? 'visible' : 'hidden' }"
                    :teamComp="enemyComp"
            />
            <Picks
                    ref="allyPicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="allyComp"
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
                ref="roster"
                class="roster"
                :bans="[]"
                :selected-out-heroes="selectedOutHeroes"
                v-on:heroSelect="onHeroSelect"
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
    import TeamComp from "../js/TeamComp";

    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(axios, backendUrl);
    export default {
        methods: {
            goToAllPick() {
                this.isAllPick = true;
                this.allyComp = TeamComp.empty();
                this.enemyComp = TeamComp.empty();
            },
            goToPreMatchPick() {
                this.isAllPick = false;
                this.allyComp = TeamComp.empty();
                this.enemyComp = TeamComp.empty();
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
                    return heroes;
                }
            }
        },
        mounted: function () {
            this.$refs.roster.heroes.replaceAll(heroes);
        },
        data() {
            return {
                isAllPick: true,
                allyComp: TeamComp.empty(),
                enemyComp: TeamComp.empty(),
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
