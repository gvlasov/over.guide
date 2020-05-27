<template>
    <Roster
            :bans="bans"
            :heroes="suggestion.heroesSorted(h => -h.score)"
            :suggestion="suggestion"
            v-if="suggestion !== null"
    />
</template>

<script>
    import PickSuggestion from "../js/PickSuggestion.js";
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
        },
        methods: {},
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
