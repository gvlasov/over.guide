<template>
    <RosterFrame>
        <RosterPortrait
                v-for="hero in heroes"
                v-bind:key="hero.dataName"
                :hero="hero"
                :banned="isHeroBanned(hero)"
                :selected="isHeroSelected(hero)"
                :pickScore="pickScore(hero)"
                v-bind:class="{ selected: isHeroSelected(hero) }"
        />
    </RosterFrame>
</template>

<script>
    import PickSuggestion from "@/js/PickSuggestion";
    import RosterFrame from "@/vue/roster/RosterFrame";
    import Roster_BansMixin from "@/vue/roster/Roster_BansMixin";
    import Roster_SelectedHeroesMixin
        from "@/vue/roster/Roster_SelectedHeroesMixin";
    import RosterPortrait from "@/vue/RosterPortrait";

    export default {
        mixins: [
            Roster_BansMixin,
            Roster_SelectedHeroesMixin,
        ],
        props: {
            suggestion: {
                type: PickSuggestion,
                default: () => null
            },
            selectedHeroes: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            heroes() {
                return this.suggestion.heroesSorted((alternative => -alternative.score));
            },
        },
        methods: {
            pickScore(hero) {
                return this.suggestion.score(hero);
            }
        },
        components: {
            RosterPortrait,
            RosterFrame,
        },
    };

</script>

<style scoped>
</style>
