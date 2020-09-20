<template>
    <div class="root">
        <Keypress
                key-event="keydown"
                :key-code="32"
                @success="nextPick"
                :preventDefault="true"
        />
        <RoleSelection
                @rolesApproved="onRolesApproved"
                v-if="roles === null"
        />
        <div v-if="roles !== null">
            <div style="position: relative">
                <Picks
                        ref="enemyPicks"
                        style="margin-bottom: 1.5vw;"
                        :teamComp="context.enemyComp"
                />
                <Picks
                        ref="teammatePicks"
                        style="margin-bottom: 1.5vw;"
                        :teamComp="context.teammateComp"
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
                    @heroSelect="onHeroSelect"
                    v-if="suggestion === null"
            />
            <SuggestionRoster
                    ref="suggestionRoster"
                    :bans="context.bans"
                    :suggestion="suggestion"
                    :selected-heroes="[selectedHero]"
                    :selection-on-tap-enabled="false"
                    v-if="suggestion !== null"
            />
        </div>
    </div>
</template>

<script>
import Picks from '@/vue/training/Picks.vue';
import Backend from '@/ts/Backend';
import PickContextGenerator from "@/ts/PickContextGenerator";
import axios from "axios";
import Keypress from 'vue-keypress'
import PickContext from "@/ts/PickContext";
import SuggestionRoster from "@/vue/training/SuggestionRoster.vue";
import SelectionRoster from "@/vue/training/SelectionRoster.vue";
import RoleSelection from "@/vue/training/RoleSelection.vue";
import SeededShuffler from "data/generators/SeededShuffler";
import MapId from "data/MapId";

const backend = new Backend(axios);
    const generator = new PickContextGenerator(
        new SeededShuffler('asdf')
    );
    export default {
        methods: {
            nextPick() {
                this.context = generator.generateForRandomRole(this.roles);
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
                            this.context.teammateComp,
                            this.context.enemyComp,
                            this.context.bans,
                            MapId.Hanamura
                        )
                    )
                    .then(suggestion => {
                        this.suggestion = suggestion;
                        this.selectedHero = hero;
                    });
            },
            onRolesApproved(roles) {
                if (roles === []) {
                    return;
                }
                this.roles = roles;
                this.context = generator.generateForRandomRole(roles);
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
                context: null,
                suggestion: null,
                selectedHero: null,
                roles: null
            };
        },
        components: {
            RoleSelection: RoleSelection,
            SelectionRoster: SelectionRoster,
            SuggestionRoster: SuggestionRoster,
            Picks: Picks,
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
