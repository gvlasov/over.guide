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
                    :teamComp="context.enemyComp"
            />
            <Picks
                    ref="allyPicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="context.allyComp"
            />
            <input
                    type="button"
                    class="next-pick-button"
                    value="⏭️"
                    v-hammer:tap="nextPick"
                    :disabled="!pickMade"
            />
        </div>
        <SelectionRoster
                ref="roster"
                :context="context"
                :show-only-available-roles="true"
                v-on:heroSelect="onHeroSelect"
                v-if="suggestion === null"
        />
        <SuggestionRoster
                ref="suggestionRoster"
                :bans="context.bans"
                :suggestion="suggestion"
                :selected-hero="selectedHero"
                v-if="suggestion !== null"
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
    import PickContext from "../js/PickContext";
    import SuggestionRoster from "./SuggestionRoster.vue";
    import SelectionRoster from "./SelectionRoster.vue";

    let backendUrl = window.location.protocol + "//" + window.location.hostname + ":" + env.BACKEND_PORT;
    const backend = new Backend(axios, backendUrl);
    let shuffleCounter = 0;
    const generator = new PickContextGenerator();
    export default {
        methods: {
            nextPick() {
                this.context = generator.generateForRandomRole(shuffleCounter++);
                this.selectedHero = null;
                this.suggestion = null;
            },
            /**
             * @param {Hero} hero
             */
            onHeroSelect: function (hero) {
                if (this.pickMade) {
                    return;
                }
                backend
                    .suggestPick(
                        new PickContext(
                            this.context.allyComp,
                            this.context.enemyComp,
                            this.context.bans,
                            "Hanamura"
                        )
                    )
                    .then(suggestion => {
                        this.suggestion = suggestion;
                        this.selectedHero = hero;
                    })
                    .catch(reason => alert(reason));
            },
        },
        computed: {
            /**
             * @return {boolean}
             */
            pickMade() {
                return this.suggestion !== null;
            },
            /**
             * @return {Hero[]}
             */
            displayedHeroes() {
                if (this.suggestion === null) {
                    return this.context.heroesLeftForRoster();
                } else {
                    return this.suggestion.heroesSorted(hero => -this.suggestion.score(hero))
                }
            },
        },
        data() {
            return {
                context: generator.generateForRandomRole(shuffleCounter++),
                suggestion: null,
                selectedHero: null,
            };
        },
        components: {
            SelectionRoster: SelectionRoster,
            SuggestionRoster: SuggestionRoster,
            Picks: Picks,
            Roster: Roster,
            Keypress: Keypress,
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

</style>
