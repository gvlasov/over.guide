<template>
    <div class="root">
        <div style="position: relative">
            <Picks
                    ref="enemyPicks"
                    style="margin-bottom: 1.5vw;"
                    v-bind:style="{ visibility: context.isAllPick() ? 'visible' : 'hidden' }"
                    :teamComp="enemyCompOrEmpty"
                    @pickTap="unselectEnemyHero"
            />
            <Picks
                    ref="teammatePicks"
                    style="margin-bottom: 1.5vw;"
                    :teamComp="context.teammateComp"
                    @pickTap="unselectTeammateHero"
            />
            <input
                    type="button"
                    class="mode-change-button"
                    value="all picks"
                    v-hammer:tap="goToAllPick"
                    v-if="!context.isAllPick()"
            />
            <input
                    type="button"
                    class="mode-change-button"
                    value="pre match picks"
                    v-hammer:tap="goToPreMatchPick"
                    v-if="context.isAllPick()"
            />
        </div>
        <SelectionRoster
                ref="picksRoster"
                :context="context"
                :show-only-available-roles="false"
                @heroSelect="onHeroSelect"
                v-if="suggestion === null"
        />
        <SuggestionRoster
                ref="suggestionsRoster"
                :bans="bans"
                :suggestion="suggestion"
                v-if="suggestion !== null"
        />
    </div>
</template>

<script>
import Picks from '@/vue/training/Picks.vue';
import Backend from '@/js/Backend';
import axios from "axios";
import SuggestionRoster from "./SuggestionRoster.vue";
import SelectionRoster from "./SelectionRoster.vue";
import PickContextGenerator from "@/js/PickContextGenerator";
import TeamComp from "@/js/TeamComp";
import SeededShuffler from "data/generators/SeededShuffler";

const backend = new Backend(axios);
    const contextGenerator = new PickContextGenerator(
        new SeededShuffler('asdf')
    );
    export default {
        props: {
            bans: {
                type: Array,
                default: () => [],
            },
        },
        methods: {
            goToAllPick() {
                this.context = contextGenerator.generateEmptyAllPick();
                this.suggestion = null;
            },
            goToPreMatchPick() {
                this.context = contextGenerator.generateEmptyTeammatesOnly();
                this.suggestion = null;
            },
            unselectTeammateHero(hero, position) {
                if (hero === null) {
                    return;
                }
                this.context.teammateComp.unsetAtPosition(position);
                this.suggestion = null;
            },
            unselectEnemyHero(hero, position) {
                if (hero === null) {
                    return;
                }
                this.context.enemyComp.unsetAtPosition(position);
                this.suggestion = null;
            },
            /**
             * @param {HeroDto} hero
             */
            onHeroSelect(hero) {
                if (this.context.isAllPick() && !this.context.enemyComp.isFull()) {
                    if (this.context.enemyComp.canSelect(hero)) {
                        this.context.enemyComp.setNextAvailable(hero);
                    } else {
                        throw new Error("Can't select " + hero.name + " in enemy comp");
                    }
                } else if (this.context.teammateComp.canSelect(hero)) {
                    this.context.teammateComp.setNextAvailable(hero);
                } else {
                    throw new Error("Can't select " + hero.name + " in either comp");
                }
                if (
                    (!this.context.isAllPick() || this.context.enemyComp.isFull())
                    && this.context.teammateComp.numberOfVacancies() === 1
                ) {
                    const self = this;
                    backend
                        .suggestPick(this.context)
                        .then(suggestion => {
                            self.suggestion = suggestion;
                        })
                        .catch(reason => alert(reason));
                }
            },
        },
        computed: {
            enemyCompOrEmpty() {
                return this.context.enemyComp || TeamComp.empty();
            },
        },
        watch: {
            'context.teammateComp': (n, o) => true,
            'context.enemyComp': (n, o) => true,
        },
        data() {
            return {
                context: contextGenerator.generateEmptyAllPick(),
                suggestion: null,
            }
        },
        components: {
            SelectionRoster,
            SuggestionRoster: SuggestionRoster,
            Picks: Picks,
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
