<template>
    <RosterFrame>
        <RosterPortrait
                v-for="hero in heroes"
                v-bind:key="hero.dataName"
                :hero="hero"
                :banned="isHeroBanned(hero)"
                :selected-out="isHeroSelectedOut(hero)"
                :selected="isHeroSelected(hero)"
                v-bind:class="{ selected: isHeroSelected(hero) }"
                @heroSelect="onHeroSelect"
        />
    </RosterFrame>
</template>

<script>
    import PickContext from "@/js/PickContext";
    import heroes from "data/heroes";
    import RosterFrame from '@/vue/roster/RosterFrame.vue'
    import Roster_SelectedHeroesMixin
        from "@/vue/roster/Roster_SelectedHeroesMixin";
    import Roster_SelectedOutHeroesMixin
        from "@/vue/roster/Roster_SelectedOutHeroesMixin";
    import RosterPortrait from "@/vue/RosterPortrait";
    import Roster_BansMixin from "@/vue/roster/Roster_BansMixin";

    export default {
        mixins: [
            Roster_SelectedHeroesMixin,
            Roster_SelectedOutHeroesMixin,
            Roster_BansMixin,
        ],
        props: {
            context: {
                type: PickContext
            },
            showOnlyAvailableRoles: {
                type: Boolean,
                default: false
            },
            selectedHeroes: {
                type: Array,
                default: () => [],
            },
        },
        computed: {
            heroes() {
                if (this.showOnlyAvailableRoles) {
                    return this.context.heroesLeftForRoster()
                } else {
                    return Array.from(heroes.values());
                }
            },
            /**
             * @return {HeroDto[]}
             */
            selectedOutHeroes() {
                return this.context.selectedOutHeroes();
            },
        },
        methods: {
            onHeroSelect(hero) {
                this.$emit('heroSelect', hero)
                this.clearSelection();
            }
        },
        data() {
            return {}
        },
        components: {
            RosterPortrait,
            RosterFrame,
        },
    };

</script>

<style scoped>
</style>
