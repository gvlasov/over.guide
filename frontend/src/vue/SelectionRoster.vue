<template>
    <Roster
            :bans="context.bans"
            :heroes="heroes"
            :selected-out-heroes="context.selectedOutHeroes()"
            v-on:heroSelect="onHeroSelect"
    />
</template>

<script>
    import PickContext from "../js/PickContext";
    import Roster from "./Roster.vue";
    import heroes from "../js/heroes";

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
                    return [...heroes];
                }
            },
            hs() {
                return [...heroes];
            }
        },
        methods: {
            onHeroSelect(hero) {
                this.$emit('heroSelect', hero)
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
