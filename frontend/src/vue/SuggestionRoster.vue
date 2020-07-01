<template>
    <Roster
            :bans="bans"
            :heroes="suggestion.heroesSorted(h => -h.score)"
            :selected-hero="selectedHero"
            :pick-score="pickScore"
    />
</template>

<script>
    import PickSuggestion from "../js/PickSuggestion";
    import Roster from "./Roster.vue";
    import Hero from "data/dto/Hero";

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
            selectedHero: {
                type: Object,
                default: () => null
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
