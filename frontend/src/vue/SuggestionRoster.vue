<template>
    <Roster
            :bans="bans"
            :heroes="suggestion.heroesSorted(h => -h.score)"
            :selected-heroes="selectedHeroes"
            :pick-score="pickScore"
            :selection-on-tap-enabled="false"
    />
</template>

<script>
    import PickSuggestion from "../js/PickSuggestion";
    import Roster from "./Roster.vue";

    export default {
        props: {
            bans: {
                type: Array,
                default: () => []
            },
            suggestion: {
                type: PickSuggestion,
                default: () => null
            },
            selectedHeroes: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            pickScore: function (hero) {
                return this.suggestion.score(hero);
            }
        },
        data() {
            return {}
        },
        components: {
            Roster: Roster,
        },
    };

</script>

<style scoped>
</style>
