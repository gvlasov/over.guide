<template>
    <Roster
            ref="roster"
            :bans="context.bans"
            :heroes="heroes"
            :selected-out-heroes="context.selectedOutHeroes()"
            @selectedHeroesChange="onHeroSelect"
            :selection-on-tap-enabled="true"
    />
</template>

<script>
    import PickContext from "../js/PickContext";
    import Roster from "./Roster.vue";
    import heroes from "data/heroes";

    export default {
        props: {
            context: {
                type: PickContext
            },
            showOnlyAvailableRoles: {
                type: Boolean,
                default: false
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
        },
        methods: {
            onHeroSelect(heroes) {
                this.$emit('selectedHeroesChange', heroes)
                this.$refs.roster.clearSelection();
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
